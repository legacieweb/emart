import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '../services/api'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsAPI.getAll({ limit: 8 })
      .then(res => setProducts(res.data.products))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to eMart</h1>
          <p>Discover amazing products with vibrant colors and incredible deals</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <Link to="/products" className="btn btn-outline">Browse Catalog</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Shopping Experience" />
        </div>
      </section>

      <section className="categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books', 'Toys'].map(cat => (
            <Link key={cat} to={`/products?category=${cat}`} className="category-card">
              <h3>{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <div className="loading">Loading amazing products...</div>
        ) : (
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
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    {product.rating} / 5 stars
                  </div>
                  <div className="product-price">
                    <span className="price">${product.price}</span>
                    {product.discount > 0 && (
                      <span className="original-price">
                        ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-muted">{product.stock} in stock</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose eMart?</h2>
        <div className="features-grid">
          <div className="feature-box">
            <h3>Fast Delivery</h3>
            <p>Quick and reliable shipping to your doorstep</p>
          </div>
          <div className="feature-box">
            <h3>Secure Payment</h3>
            <p>Protected transactions with multiple payment options</p>
          </div>
          <div className="feature-box">
            <h3>Easy Returns</h3>
            <p>Hassle-free returns within 30 days</p>
          </div>
          <div className="feature-box">
            <h3>Quality Products</h3>
            <p>Curated selection of premium items</p>
          </div>
        </div>
      </section>
    </div>
  )
}
