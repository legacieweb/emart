import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ordersAPI } from '../services/api'
import './ThankYou.css'

export default function ThankYou() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ordersAPI.getById(orderId)
        setOrder(response.data)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const downloadReceipt = () => {
    if (!order) return

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order Receipt - ${order._id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
          .receipt { max-width: 600px; margin: 20px auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #667eea; margin-bottom: 10px; }
          .receipt-title { color: #333; margin: 10px 0; }
          .order-number { color: #666; font-size: 14px; }
          .section { margin: 25px 0; }
          .section-title { font-weight: bold; color: #333; font-size: 14px; text-transform: uppercase; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
          .detail-label { color: #666; font-size: 13px; }
          .detail-value { color: #333; font-weight: 500; }
          .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .items-table thead { background: #f9f9f9; }
          .items-table th { padding: 12px; text-align: left; font-weight: bold; color: #333; font-size: 13px; border-bottom: 2px solid #667eea; }
          .items-table td { padding: 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
          .item-name { color: #333; font-weight: 500; }
          .item-qty { text-align: center; color: #666; }
          .item-price { text-align: right; color: #333; }
          .totals { margin-top: 20px; padding-top: 15px; border-top: 2px solid #667eea; }
          .total-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; }
          .total-label { color: #666; }
          .total-amount { font-weight: bold; color: #667eea; font-size: 16px; }
          .grand-total { display: flex; justify-content: space-between; margin: 15px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; font-size: 16px; font-weight: bold; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
          .thank-you { text-align: center; color: #667eea; font-weight: bold; margin-top: 20px; }
          @media print { body { background: white; } .receipt { box-shadow: none; margin: 0; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">🛍️ E-Mart</div>
            <h1 class="receipt-title">Order Receipt</h1>
            <p class="order-number">Order ID: ${order._id}</p>
          </div>

          <div class="section">
            <div class="section-title">Order Information</div>
            <div class="detail-row">
              <span class="detail-label">Order Date:</span>
              <span class="detail-value">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Order Status:</span>
              <span class="detail-value" style="color: #667eea; text-transform: capitalize;">${order.orderStatus}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Status:</span>
              <span class="detail-value" style="color: #667eea; text-transform: capitalize;">${order.paymentStatus}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Shipping Address</div>
            <div style="color: #333; line-height: 1.8; font-size: 13px;">
              <p>${order.shippingAddress?.street}</p>
              <p>${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.zipCode}</p>
              <p>${order.shippingAddress?.country}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Product</th>
                  <th class="item-qty">Quantity</th>
                  <th class="item-price">Price</th>
                  <th class="item-price">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td class="item-name">${item.product.name || 'Product'}</td>
                    <td class="item-qty">${item.quantity}</td>
                    <td class="item-price">$${item.price.toFixed(2)}</td>
                    <td class="item-price">$${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="totals">
              <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-amount">$${order.totalAmount.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span class="total-label">Tax:</span>
                <span class="total-amount">$0.00</span>
              </div>
              <div class="total-row">
                <span class="total-label">Shipping:</span>
                <span class="total-amount">FREE</span>
              </div>
              <div class="grand-total">
                <span>Grand Total:</span>
                <span>$${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p class="thank-you">Thank you for your purchase! 🎉</p>
            <p>We appreciate your business and hope you enjoy your products.</p>
            <p style="margin-top: 15px;">For questions about your order, please contact support@emart.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const blob = new Blob([receiptHTML], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `receipt-${order._id}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="thank-you-page"><p>Loading order details...</p></div>
  }

  if (!order) {
    return (
      <div className="thank-you-page">
        <div className="thank-you-container">
          <div className="error-state">
            <span className="error-icon">❌</span>
            <h1>Order Not Found</h1>
            <p>We couldn't find your order. Please check your order ID.</p>
            <button onClick={() => navigate('/orders')} className="btn btn-primary">
              View All Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <div className="success-state">
          <span className="success-icon">✅</span>
          <h1>Thank You for Your Order! 🎉</h1>
          <p className="success-message">Your order has been successfully placed and will be processed soon.</p>

          <div className="order-confirmation-card">
            <div className="order-header">
              <div>
                <p className="label">Order ID</p>
                <p className="value">{order._id}</p>
              </div>
              <div>
                <p className="label">Order Date</p>
                <p className="value">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="label">Status</p>
                <p className="value status-badge">{order.orderStatus.toUpperCase()}</p>
              </div>
            </div>

            <div className="divider"></div>

            <div className="shipping-info">
              <h3>Shipping Address</h3>
              <div className="address-box">
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>

            <div class="divider"></div>

            <div className="order-items-section">
              <h3>Order Items ({order.items.length})</h3>
              <div className="items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-details">
                      <p className="item-name">{item.product.name}</p>
                      <p className="item-meta">Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      <p className="price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider"></div>

            <div className="order-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={downloadReceipt} className="btn btn-primary">
                📥 Download Receipt
              </button>
              <button onClick={() => navigate('/orders')} className="btn btn-outline">
                View All Orders
              </button>
            </div>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps">
              <div className="step">
                <span className="step-number">1</span>
                <div>
                  <p className="step-title">Order Processing</p>
                  <p className="step-desc">We're preparing your order for shipment</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div>
                  <p className="step-title">Shipment Notification</p>
                  <p className="step-desc">You'll receive a tracking number via email</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div>
                  <p className="step-title">Delivery</p>
                  <p className="step-desc">Track your package in real-time</p>
                </div>
              </div>
            </div>
          </div>

          <div className="support-section">
            <p>Questions about your order?</p>
            <p>Contact our support team at <strong>support@emart.com</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}
