import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      login(response.data.user, response.data.token)
      navigate('/')
      alert('Welcome back! 🎉')
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔐</span>
          <h1>Login</h1>
          <p>Welcome back to eMart</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
        </div>
      </div>

      <div className="auth-illustration">
        <div className="illustration-shape shape-1">🛍️</div>
        <div className="illustration-shape shape-2">💳</div>
        <div className="illustration-shape shape-3">🎉</div>
      </div>
    </div>
  )
}
