import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { productsAPI, authAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './Products.css'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { login } = useStore()
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false)
  const [adminLoginLoading, setAdminLoginLoading] = useState(false)
  const [adminLoginFormData, setAdminLoginFormData] = useState({ email: '', password: '' })

  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books', 'Toys']

  useEffect(() => {
    setLoading(true)
    productsAPI.getAll({ search, category, page, limit: 12 })
      .then(res => setProducts(res.data.products))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [search, category, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat === category ? '' : cat)
    setPage(1)
  }

  const handleAdminLoginChange = (e) => {
    const { name, value } = e.target
    setAdminLoginFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAdminLoginLoading(true)

    try {
      const response = await authAPI.adminLogin(adminLoginFormData)
      login(response.data.user, response.data.token)
      setShowAdminLoginModal(false)
      setAdminLoginFormData({ email: '', password: '' })
      navigate('/admin')
      alert('✅ Admin login successful!')
    } catch (error) {
      alert('❌ Login failed: ' + (error.response?.data?.message || 'Invalid admin credentials'))
      setAdminLoginFormData({ email: '', password: '' })
    } finally {
      setAdminLoginLoading(false)
    }
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <aside className="filters">
          <div className="filter-section">
            <h3>Search</h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                Search
              </button>
            </form>
          </div>

          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={!category}
                  onChange={() => setCategory('')}
                />
                <span>All</span>
              </label>
              {categories.map(cat => (
                <label key={cat} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={category === cat}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="products-section">
          <div className="products-header">
            <h2 className="section-title">{category ? `${category} Products` : 'All Products'}</h2>
            <button 
              onClick={() => setShowAdminLoginModal(true)}
              className="admin-login-btn"
              title="Admin Login"
            >
              🔐 Admin Login
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>No products found. Try adjusting your filters! 🔍</p>
            </div>
          ) : (
            <>
              <div className="grid grid-4">
                {products.map(product => (
                  <Link key={product._id} to={`/products/${product._id}`} className="card product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      {product.discount > 0 && (
                        <div className="discount-badge">-{product.discount}%</div>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="badge badge-primary">{product.category}</span>
                      <h3>{product.name}</h3>
                      <div className="product-rating">
                        {'⭐'.repeat(Math.floor(product.rating))} {product.rating.toFixed(1)}
                      </div>
                      <div className="product-price">
                        <span className="price">${product.price}</span>
                        {product.discount > 0 && (
                          <span className="original-price">
                            ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="stock-info">
                        {product.stock > 0 ? (
                          <span style={{ color: '#4facfe' }}>✓ {product.stock} in stock</span>
                        ) : (
                          <span style={{ color: '#f5576c' }}>Out of stock</span>
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                <span className="page-info">Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {showAdminLoginModal && (
        <div className="admin-login-modal-overlay" onClick={() => setShowAdminLoginModal(false)}>
          <div className="admin-login-modal-content" onClick={e => e.stopPropagation()}>
            <div className="admin-login-modal-header">
              <h2>🔐 Admin Portal</h2>
              <p>Enter your admin credentials to access the dashboard</p>
              <button 
                className="admin-login-modal-close"
                onClick={() => setShowAdminLoginModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="admin-login-modal-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={adminLoginFormData.email}
                  onChange={handleAdminLoginChange}
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
                  value={adminLoginFormData.password}
                  onChange={handleAdminLoginChange}
                  required
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary admin-login-modal-btn"
                disabled={adminLoginLoading}
              >
                {adminLoginLoading ? 'Logging in...' : 'Login to Admin'}
              </button>
            </form>

            <div className="admin-login-modal-footer">
              <p>Access restricted to administrators only</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
