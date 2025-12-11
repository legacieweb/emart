import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { sendOrderStatusUpdateEmail, sendPaymentStatusUpdateEmail } from '../utils/emailService.js';

const router = express.Router();

router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      revenue: revenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/orders', authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/products', authenticate, adminOnly, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/order/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: orderStatus || undefined,
        paymentStatus: paymentStatus || undefined,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('user', 'email name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user && order.user.email) {
      if (orderStatus) {
        await sendOrderStatusUpdateEmail(order.user.email, order._id, orderStatus);
      }
      if (paymentStatus) {
        await sendPaymentStatusUpdateEmail(order.user.email, order._id, paymentStatus);
      }
    }

    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
