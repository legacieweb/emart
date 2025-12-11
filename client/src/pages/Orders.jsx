import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ordersAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './Orders.css'

export default function Orders() {
  const navigate = useNavigate()
  const { token } = useStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    loadOrders()
  }, [token])

  const loadOrders = async () => {
    try {
      const res = await ordersAPI.getAll()
      setOrders(res.data)
    } catch (error) {
      console.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f5a623',
      processing: '#667eea',
      shipped: '#4facfe',
      delivered: '#00f2fe',
      cancelled: '#f5576c'
    }
    return colors[status] || '#999'
  }

  if (loading) return <div className="loading-page">Loading orders...</div>

  return (
    <div className="orders-page">
      <h1 className="section-title">My Orders 📦</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📭</div>
          <h2>No orders yet</h2>
          <p>Start shopping and place your first order!</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span className="label">Order ID:</span>
                  <span className="value">{order._id.slice(-8)}</span>
                </div>
                <div className="order-date">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="order-total">
                  <span className="label">Total:</span>
                  <span className="value total-amount">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="order-status">
                  <span
                    className="status-badge"
                    style={{ background: getStatusColor(order.orderStatus) }}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h3>Items:</h3>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={item.product ? item.product._id : index} className="order-item">
                      <div className="item-info">
                        <span className="item-name">
                          {item.product ? item.product.name : 'Product no longer available'}
                        </span>
                        <span className="item-qty">x{item.quantity}</span>
                      </div>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <div className="address-info">
                  <span className="label">Shipping to:</span>
                  <span className="value">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                  </span>
                </div>
                <div className="payment-status">
                  <span className="label">Payment:</span>
                  <span
                    className={`status ${order.paymentStatus}`}
                    style={{
                      color: order.paymentStatus === 'completed' ? '#00f2fe' : '#f5a623'
                    }}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-actions">
                <button className="btn btn-outline view-btn">View Details</button>
                <button className="btn btn-secondary track-btn">Track Order</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
