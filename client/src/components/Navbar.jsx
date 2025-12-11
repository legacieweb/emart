import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useState, useEffect, useRef } from 'react'
import './Navbar.css'

export default function Navbar() {
  const { user, token, logout, cart } = useStore()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollYRef = useRef(0)
  const scrollTimeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      if (currentScrollY > lastScrollYRef.current) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        lastScrollYRef.current = currentScrollY
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  return (
    <nav className={`navbar ${isHidden ? 'navbar-hidden' : 'navbar-visible'}`}>
      <div className="navbar-wrapper">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🛍️</span>
            <span>eMart</span>
          </Link>
        </div>

        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/products" className="navbar-link">Products</Link></li>
          {user?.role === 'admin' && (
            <li><Link to="/admin" className="navbar-link admin-link">⚙️ Admin</Link></li>
          )}
        </ul>

        <div className="navbar-right">
          <Link to="/cart" className="nav-icon cart-icon-link">
            <span>🛒</span>
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </Link>

          {token ? (
            <div className="user-menu-wrapper">
              <button 
                className="user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span>👤</span>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/dashboard" className="dropdown-item">📊 Dashboard</Link>
                  <Link to="/orders" className="dropdown-item">📦 My Orders</Link>
                  <button onClick={handleLogout} className="dropdown-item logout-item">🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="navbar-btn navbar-btn-outline">Login</Link>
              <Link to="/register" className="navbar-btn navbar-btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
