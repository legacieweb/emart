import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail, sendOrderStatusUpdateEmail, sendPaymentStatusUpdateEmail } from '../utils/emailService.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
      totalAmount += discountedPrice * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: discountedPrice
      };
    });

    const newOrder = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    // Send order confirmation email
    try {
      const user = await User.findById(req.user.id);
      await sendOrderConfirmationEmail(user.email, newOrder);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    // Send admin notification email
    try {
      await sendAdminOrderNotificationEmail({
        orderId: newOrder._id,
        userId: req.user.id,
        totalAmount: newOrder.totalAmount,
        items: newOrder.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
    } catch (emailError) {
      console.error('Failed to send admin order notification email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id/payment-status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status, updatedAt: new Date() },
      { new: true }
    ).populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send email to user about payment status update
    try {
      await sendPaymentStatusUpdateEmail(order.user.email, order._id, status);
    } catch (emailError) {
      console.error('Failed to send payment status update email:', emailError);
      // Don't fail the update if email fails
    }

    res.json({ message: 'Payment status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
