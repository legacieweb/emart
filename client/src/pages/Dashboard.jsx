import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, token } = useStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!token) navigate('/login')
    else fetchOrders()
  }, [token])

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll()
      setOrders(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(o => filter === 'all' || o.orderStatus === filter)

  const getStatusColor = (status) => {
    const colors = { pending: '#ffc107', processing: '#0dcaf0', shipped: '#0d6efd', delivered: '#198754', cancelled: '#dc3545' }
    return colors[status] || '#6c757d'
  }

  const downloadReceipt = async (orderId) => {
    try {
      const response = await ordersAPI.getById(orderId)
      const order = response.data
      const html = `<html><body><h1>Receipt</h1><p>Order: ${order._id}</p><p>Total: $${order.totalAmount.toFixed(2)}</p></body></html>`
      const blob = new Blob([html], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${orderId}.html`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to download')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Welcome back, {user?.name}! 👋</p>
          </div>
          <div className="dashboard-stats">
            <div className="stat-card">
              <span className="stat-icon">📦</span>
              <div>
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{orders.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <div>
                <p className="stat-label">Total Spent</p>
                <p className="stat-value">${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="filters">
            <h3>Filter Orders</h3>
            <div className="filter-buttons">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${filter === status ? 'active' : ''}`}
                  onClick={() => setFilter(status)}
                  style={filter === status ? { backgroundColor: getStatusColor(status), color: 'white' } : {}}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><p>Loading your orders...</p></div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h2>No Orders</h2>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                      {order.orderStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <div className="items-count">
                      <p className="label">Items</p>
                      <p className="value">{order.items.length}</p>
                    </div>
                    <div className="order-amount">
                      <p className="label">Total</p>
                      <p className="value amount">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="payment-status">
                      <p className="label">Payment</p>
                      <p className="value">{order.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="order-card-shipping">
                    <p className="label">Shipping To</p>
                    <p className="address">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  </div>

                  <div className="order-card-actions">
                    <button onClick={() => navigate(`/thankyou/${order._id}`)} className="btn btn-outline">View Details</button>
                    <button onClick={() => downloadReceipt(order._id)} className="btn btn-primary">📥 Receipt</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
