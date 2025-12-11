import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { cartAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { token, cart, setCart, removeFromCart } = useStore()
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    loadCart()
  }, [token])

  const loadCart = async () => {
    try {
      const res = await cartAPI.getCart()
      setCartItems(res.data.items || [])
    } catch (error) {
      console.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await cartAPI.removeItem(productId)
        removeFromCart(productId)
      } else {
        await cartAPI.updateItem({ productId, quantity })
      }
      loadCart()
    } catch (error) {
      alert('Failed to update cart')
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.removeItem(productId)
      removeFromCart(productId)
      loadCart()
    } catch (error) {
      alert('Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear the cart?')) return
    try {
      await cartAPI.clearCart()
      setCartItems([])
    } catch (error) {
      alert('Failed to clear cart')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.price * (1 - item.product.discount / 100)
    return sum + price * item.quantity
  }, 0)

  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (loading) return <div className="loading-page">Loading cart...</div>

  return (
    <div className="cart-page">
      <h1 className="section-title">Shopping Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Add some amazing products to get started!</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            <div className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <span></span>
            </div>

            {cartItems.map(item => {
              const price = item.product.price * (1 - item.product.discount / 100)
              const itemTotal = price * item.quantity

              return (
                <div key={item.product._id} className="cart-item">
                  <div className="item-product">
                    <img src={item.product.image} alt={item.product.name} />
                    <div className="product-info">
                      <h3>{item.product.name}</h3>
                      <p>{item.product.category}</p>
                    </div>
                  </div>

                  <div className="item-price">
                    <span className="current">${price.toFixed(2)}</span>
                    {item.product.discount > 0 && (
                      <span className="original">${item.product.price}</span>
                    )}
                  </div>

                  <div className="item-quantity">
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${itemTotal.toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-row shipping">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary checkout-btn"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={handleClearCart}
                className="btn btn-outline clear-cart-btn"
              >
                Clear Cart
              </button>

              <Link to="/products" className="btn btn-outline continue-btn">
                Continue Shopping
              </Link>
            </div>

            <div className="promo-box">
              <h3>Promo Code</h3>
              <input type="text" placeholder="Enter promo code" className="input-field" />
              <button className="btn btn-secondary">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
