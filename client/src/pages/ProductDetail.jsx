import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsAPI, cartAPI } from '../services/api'
import { useStore } from '../store/useStore'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, addToCart } = useStore()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    productsAPI.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setAddingToCart(true)
      await cartAPI.addItem({ productId: id, quantity })
      addToCart({ product, quantity })
      alert('Added to cart! 🛍️')
    } catch (error) {
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setAddingToCart(true)
      await cartAPI.addItem({ productId: id, quantity })
      addToCart({ product, quantity })
      navigate('/checkout')
    } catch (error) {
      alert('Failed to process purchase')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) return <div className="loading-page">Loading product...</div>
  if (!product) return <div className="loading-page">Product not found</div>

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="main-image">
            <img src={product.image} alt={product.name} />
            {product.discount > 0 && (
              <div className="discount-badge-large">-{product.discount}%</div>
            )}
          </div>
        </div>

        <div className="product-details">
          <span className="category-badge">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="rating-section">
            <div className="stars">{'⭐'.repeat(Math.floor(product.rating))}</div>
            <span>{product.rating.toFixed(1)} out of 5</span>
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="pricing">
            <div className="price-group">
              <span className="label">Price:</span>
              <div className="price-display">
                <span className="current-price">${discountedPrice.toFixed(2)}</span>
                {product.discount > 0 && (
                  <span className="original-price">${product.price}</span>
                )}
              </div>
            </div>

            {product.discount > 0 && (
              <div className="savings">
                You save: <strong>${(product.price - discountedPrice).toFixed(2)}</strong>
              </div>
            )}
          </div>

          <div className="stock-status">
            {product.stock > 0 ? (
              <div className="in-stock">
                <span className="status-badge">✓ In Stock</span>
                <p>{product.stock} items available</p>
              </div>
            ) : (
              <div className="out-of-stock">
                <span className="status-badge">✗ Out of Stock</span>
              </div>
            )}
          </div>

          {product.stock > 0 && (
            <div className="purchase-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={handleBuyNow} 
                  className="btn btn-primary buy-now-btn"
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Processing...' : 'Buy Now 🚀'}
                </button>
                <button 
                  onClick={handleAddToCart} 
                  className="btn btn-secondary add-to-cart"
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart 🛒'}
                </button>
              </div>
            </div>
          )}

          <div className="product-features">
            <h3>Product Features</h3>
            <ul>
              <li>✓ Premium Quality</li>
              <li>✓ Fast Shipping</li>
              <li>✓ 30-Day Returns</li>
              <li>✓ Secure Payment</li>
            </ul>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="tags">
              <h3>Tags:</h3>
              <div className="tag-list">
                {product.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
