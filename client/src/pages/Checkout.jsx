import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersAPI, cartAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './Checkout.css'

export default function Checkout() {
  const navigate = useNavigate()
  const { token } = useStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  if (!token) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await ordersAPI.checkout({
        shippingAddress: formData
      })

      await cartAPI.clearCart()
      navigate(`/thankyou/${response.data.order._id}`)
    } catch (error) {
      alert('Failed to place order: ' + error.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <h1 className="section-title">Checkout</h1>

      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>Shipping Address</h2>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="New York"
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="10001"
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input type="radio" name="payment" value="card" defaultChecked />
                <span>Credit / Debit Card</span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" value="paypal" />
                <span>PayPal</span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment" value="bank" />
                <span>Bank Transfer</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary place-order-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order 🎉'}
          </button>
        </form>

        <div className="order-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-info">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="order-benefits">
              <h3>Order Benefits</h3>
              <ul>
                <li>✓ Free shipping on orders over $50</li>
                <li>✓ 30-day money-back guarantee</li>
                <li>✓ Secure checkout</li>
                <li>✓ Order tracking included</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
