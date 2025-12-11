import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI, authAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, login } = useStore()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingOrder, setUpdatingOrder] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginFormData, setLoginFormData] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user?.role === 'admin') {
      setShowLoginModal(false)
      loadDashboard()
    } else {
      setShowLoginModal(true)
      setLoading(false)
    }
  }, [user])

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)

    try {
      const response = await authAPI.adminLogin(loginFormData)
      login(response.data.user, response.data.token)
      setShowLoginModal(false)
      setLoginFormData({ email: '', password: '' })
      loadDashboard()
    } catch (error) {
      alert('❌ Login failed: ' + (error.response?.data?.message || 'Invalid admin credentials'))
      setLoginFormData({ email: '', password: '' })
    } finally {
      setLoginLoading(false)
    }
  }

  const loadDashboard = async () => {
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllOrders(),
        adminAPI.getAllProducts(),
        adminAPI.getAllUsers()
      ])

      setStats(statsRes.data)
      setOrders(ordersRes.data || [])
      setProducts(productsRes.data || [])
      setUsers(usersRes.data || [])
    } catch (error) {
      console.error('Dashboard error:', error)
      alert('Failed to load dashboard data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      setUpdatingOrder(true)
      await adminAPI.updateOrderStatus(orderId, { orderStatus, paymentStatus })
      
      setOrders(orders.map(order =>
        order._id === orderId
          ? { ...order, orderStatus, paymentStatus }
          : order
      ))
      setSelectedOrder(null)
      alert('Order updated successfully!')
    } catch (error) {
      alert('Failed to update order: ' + error.message)
    } finally {
      setUpdatingOrder(false)
    }
  }

  if (loading && !showLoginModal) return <div className="loading-page">Loading dashboard...</div>

  if (showLoginModal) {
    return (
      <div className="login-modal-overlay">
        <div className="login-modal-content">
          <div className="modal-header">
            <h2>🔐 Admin Portal</h2>
            <p>Enter your admin credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleAdminLogin} className="login-modal-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={loginFormData.email}
                onChange={handleLoginChange}
                required
                className="input-field"
                placeholder="admin@emart.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginFormData.password}
                onChange={handleLoginChange}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary login-modal-btn"
              disabled={loginLoading}
            >
              {loginLoading ? 'Logging in...' : 'Login to Admin'}
            </button>
          </form>

          <div className="modal-footer">
            <p>Access restricted to administrators only</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard 👨‍💼</h1>
        <p>Welcome, {user?.name}! Manage your e-commerce platform</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🛍️ Products ({products.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="admin-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛍️</div>
              <div className="stat-content">
                <h3>Total Products</h3>
                <p className="stat-value">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">${stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="recent-orders">
            <h2>Recent Orders</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.slice(-6)}</td>
                      <td>{order.user.name}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className="status-badge" style={{
                          background: order.orderStatus === 'delivered' ? '#00f2fe' : '#f5a623'
                        }}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <h2>All Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="empty-message">No orders yet</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Order Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.slice(-6)}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>{order.items?.length || 0}</td>
                      <td>${order.totalAmount?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className="status-badge" style={{
                          background: order.orderStatus === 'delivered' ? '#00f2fe' : '#f5a623'
                        }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge" style={{
                          background: order.paymentStatus === 'completed' ? '#4facfe' : '#f5a623'
                        }}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn"
                          onClick={() => setSelectedOrder(order)}
                        >
                          ✏️ Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {selectedOrder && (
            <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Update Order #{selectedOrder._id.slice(-6)}</h3>
                  <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
                </div>
                
                <div className="modal-body">
                  <div className="order-details">
                    <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                    <p><strong>Total:</strong> ${selectedOrder.totalAmount?.toFixed(2)}</p>
                    <p><strong>Items:</strong> {selectedOrder.items?.length || 0}</p>
                  </div>

                  <div className="form-group">
                    <label>Order Status</label>
                    <select 
                      value={selectedOrder.orderStatus}
                      onChange={(e) => setSelectedOrder({...selectedOrder, orderStatus: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Payment Status</label>
                    <select 
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => setSelectedOrder({...selectedOrder, paymentStatus: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleUpdateOrderStatus(
                        selectedOrder._id, 
                        selectedOrder.orderStatus, 
                        selectedOrder.paymentStatus
                      )}
                      disabled={updatingOrder}
                    >
                      {updatingOrder ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-section">
          <h2>All Products ({products.length})</h2>
          {products.length === 0 ? (
            <p className="empty-message">No products yet</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Discount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={product.stock > 10 ? 'stock-ok' : 'stock-low'}>
                          {product.stock}
                        </span>
                      </td>
                      <td>⭐ {product.rating?.toFixed(1) || '0.0'}</td>
                      <td>{product.discount || 0}%</td>
                      <td>
                        <span className="status-badge" style={{
                          background: product.stock > 0 ? '#4facfe' : '#f5a623'
                        }}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>All Users ({users.length})</h2>
          {users.length === 0 ? (
            <p className="empty-message">No users yet</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        {user.address?.city ? `${user.address.city}, ${user.address.state}` : '-'}
                      </td>
                      <td>
                        <span className="role-badge" style={{
                          background: user.role === 'admin' ? '#667eea' : '#4facfe'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
