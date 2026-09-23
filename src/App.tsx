import { useState } from 'react'
import './App.css'

type Product = {
  product_id: string
  barcode: string
  product_name: string
  brand: string
  category: string
  image: string
}

function App() {
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchProducts = async () => {
    if (!query.trim()) {
      setError('Please enter a product name.')
      setProducts([])
      return
    }

    setLoading(true)
    setError('')
    setProducts([])

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/products/search?q=${encodeURIComponent(query)}`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to retrieve product information.')
      }

      if (!data.products || data.products.length === 0) {
        setError('No matching Indian product found.')
      } else {
        setProducts(data.products)
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to retrieve product information. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (showSearch) {
    return (
      <div className="app">
        <header className="navbar">
          <div className="logo">
            <div className="logo-icon">N</div>
            <span>NEXORA</span>
          </div>

          <button
            className="profile-button"
            onClick={() => setShowSearch(false)}
          >
            Back
          </button>
        </header>

        <main className="search-page">
          <h1>Search Product</h1>
          <p>Search for a packaged food product available in India.</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Enter product name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchProducts()
                }
              }}
            />

            <button onClick={searchProducts} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && <p className="search-error">{error}</p>}

          <div className="search-results">
            {products.map((product) => (
              <div className="product-result" key={product.product_id}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.product_name || 'Product'}
                  />
                ) : (
                  <div className="product-image-placeholder">No Image</div>
                )}

                <div className="product-details">
                  <h3>{product.product_name || 'Product name unavailable'}</h3>

                  <p>
                    <strong>Brand:</strong>{' '}
                    {product.brand || 'Information not available'}
                  </p>

                  <p>
                    <strong>Category:</strong>{' '}
                    {product.category || 'Information not available'}
                  </p>

                  <p>
                    <strong>Barcode:</strong>{' '}
                    {product.barcode || 'Information not available'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <div className="logo-icon">N</div>
          <span>NEXORA</span>
        </div>

        <button className="profile-button">Profile</button>
      </header>

      <main className="home">
        <section className="hero-section">
          <div className="hero-badge">Smart Food Quality & Safety</div>

          <h1>
            Don’t just read the label.
            <br />
            <span>Understand it.</span>
          </h1>

          <p>Know what’s inside your packaged food before you buy it.</p>
        </section>

        <section className="input-section">
          <h2>How would you like to check your product?</h2>

          <div className="input-options">
            <button
              className="input-option"
              onClick={() => setShowSearch(true)}
            >
              <div className="option-icon search-icon">⌕</div>

              <div>
                <strong>Search Product</strong>
                <small>Find a packaged food product</small>
              </div>
            </button>

            <button className="input-option">
              <div className="option-icon scan-icon">▣</div>

              <div>
                <strong>Scan Barcode</strong>
                <small>Scan the product barcode</small>
              </div>
            </button>

            <button className="input-option">
              <div className="option-icon upload-icon">↑</div>

              <div>
                <strong>Upload Product Image</strong>
                <small>Upload or capture the label</small>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App