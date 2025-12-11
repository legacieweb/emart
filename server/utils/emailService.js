import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOrderConfirmationEmail = async (to, orderDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `Order Confirmation - Order ID: ${orderDetails.orderId}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order has been successfully placed.</p>
        <hr>
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Total Amount:</strong> $${orderDetails.totalAmount.toFixed(2)}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${orderDetails.items
            .map(
              (item) =>
                `<li>${item.name} - Quantity: ${item.quantity} - Price: $${(
                  item.price * item.quantity
                ).toFixed(2)}</li>`
            )
            .join('')}
        </ul>
        <hr>
        <p>Your order will be shipped soon. You will receive a shipping confirmation email shortly.</p>
        <p>Thank you for shopping with E-Mart!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${to}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, message: error.message };
  }
};

export const sendWelcomeEmail = async (to, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Welcome to E-Mart!',
      html: `
        <h2>Welcome to E-Mart, ${userName}!</h2>
        <p>We're excited to have you on board.</p>
        <p>With E-Mart, you can:</p>
        <ul>
          <li>Browse a wide range of products</li>
          <li>Find the best deals and discounts</li>
          <li>Secure checkout and fast delivery</li>
          <li>Track your orders in real-time</li>
        </ul>
        <p>Start shopping now and enjoy 10% off on your first order with code: <strong>WELCOME10</strong></p>
        <p>Happy shopping!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: error.message };
  }
};

export const sendPasswordResetEmail = async (to, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy this link: <br>${resetLink}</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: error.message };
  }
};

export const sendShippingNotificationEmail = async (to, trackingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `Your order has been shipped - Tracking ID: ${trackingDetails.trackingId}`,
      html: `
        <h2>Your order has been shipped!</h2>
        <p>Great news! Your order is on its way.</p>
        <hr>
        <h3>Shipping Details</h3>
        <p><strong>Tracking ID:</strong> ${trackingDetails.trackingId}</p>
        <p><strong>Expected Delivery:</strong> ${trackingDetails.expectedDelivery}</p>
        <p><strong>Carrier:</strong> ${trackingDetails.carrier}</p>
        <hr>
        <p>Track your package: <a href="${trackingDetails.trackingLink}">${trackingDetails.trackingLink}</a></p>
        <p>Thank you for shopping with E-Mart!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Shipping notification email sent to ${to}`);
    return { success: true, message: 'Shipping notification email sent successfully' };
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    return { success: false, message: error.message };
  }
};

export const sendContactFormEmail = async (from, name, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      replyTo: from,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${from})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>To reply, use: ${from}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact form email received from ${from}`);
    return { success: true, message: 'Your message has been sent successfully' };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, message: error.message };
  }
};

export const sendAdminOrderNotificationEmail = async (orderDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - Order ID: ${orderDetails.orderId}`,
      html: `
        <h2>New Order Notification</h2>
        <p>A new order has been placed on E-Mart.</p>
        <hr>
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>User ID:</strong> ${orderDetails.userId}</p>
        <p><strong>Total Amount:</strong> $${orderDetails.totalAmount.toFixed(2)}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${orderDetails.items
            .map(
              (item) =>
                `<li>${item.name} - Quantity: ${item.quantity} - Price: $${(
                  item.price * item.quantity
                ).toFixed(2)}</li>`
            )
            .join('')}
        </ul>
        <hr>
        <p>Please process this order promptly.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin order notification email sent for order ${orderDetails.orderId}`);
    return { success: true, message: 'Admin notification email sent successfully' };
  } catch (error) {
    console.error('Error sending admin order notification email:', error);
    return { success: false, message: error.message };
  }
};

export const sendOrderStatusUpdateEmail = async (to, orderId, newStatus) => {
  try {
    const statusMessages = {
      pending: 'Your order is pending and will be processed soon.',
      processing: 'Your order is being processed and prepared for shipment.',
      shipped: 'Great news! Your order has been shipped and is on its way to you.',
      delivered: 'Your order has been delivered. Thank you for your purchase!',
      cancelled: 'Your order has been cancelled. Please contact support for more details.'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `Order Status Update - Order #${orderId.toString().slice(-6)} is now ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Your Order Status Has Been Updated</h2>
          <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
          <hr style="border: none; border-top: 2px solid #e0e0e0;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> #${orderId.toString().slice(-6)}</p>
          <p><strong>New Status:</strong> <span style="color: #667eea; font-weight: bold; text-transform: capitalize;">${newStatus}</span></p>
          <hr style="border: none; border-top: 2px solid #e0e0e0;">
          <p>If you have any questions about your order, please don't hesitate to contact our support team.</p>
          <p style="color: #999; font-size: 12px;">Thank you for shopping with E-Mart!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${to} for order ${orderId}`);
    return { success: true, message: 'Order status update email sent successfully' };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return { success: false, message: error.message };
  }
};

export const sendPaymentStatusUpdateEmail = async (to, orderId, newStatus) => {
  try {
    const paymentMessages = {
      pending: 'We are awaiting payment confirmation for your order.',
      completed: 'Your payment has been successfully received. Thank you!',
      failed: 'There was an issue processing your payment. Please contact support.'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: `Payment Status Update - Order #${orderId.toString().slice(-6)} - ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Your Payment Status Has Been Updated</h2>
          <p>${paymentMessages[newStatus] || 'Your payment status has been updated.'}</p>
          <hr style="border: none; border-top: 2px solid #e0e0e0;">
          <h3>Payment Details</h3>
          <p><strong>Order ID:</strong> #${orderId.toString().slice(-6)}</p>
          <p><strong>Payment Status:</strong> <span style="color: #667eea; font-weight: bold; text-transform: capitalize;">${newStatus}</span></p>
          <hr style="border: none; border-top: 2px solid #e0e0e0;">
          <p>If you have any questions about your payment, please don't hesitate to contact our support team.</p>
          <p style="color: #999; font-size: 12px;">Thank you for shopping with E-Mart!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment status update email sent to ${to} for order ${orderId}`);
    return { success: true, message: 'Payment status update email sent successfully' };
  } catch (error) {
    console.error('Error sending payment status update email:', error);
    return { success: false, message: error.message };
  }
};

export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return { success: true, message: 'Email service is configured correctly' };
  } catch (error) {
    console.error('❌ Email service verification failed:', error);
    return { success: false, message: error.message };
  }
};
