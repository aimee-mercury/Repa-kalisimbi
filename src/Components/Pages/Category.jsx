import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Star, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '../Layout/Footer'
import '../../Styles/Category.scss'
import { useCurrency } from '../../CurrencyContext'

const productsCatalog = [
  {
    id: 1,
    name: 'Anker 737 GaN Charger 120W',
    category: 'Accessories',
    price: 89.99,
    originalPrice: 109.99,
    image: '/Images/comp1.jpg',
    rating: 5,
    reviews: 245,
  },
  {
    id: 2,
    name: 'Logitech MX Keys S Keyboard',
    category: 'Accessories',
    price: 129.99,
    originalPrice: 149.99,
    image: '/Images/comp2.jpg',
    rating: 5,
    reviews: 190,
  },
  {
    id: 3,
    name: 'Apple iPhone 15 Pro 256GB',
    category: 'Smartphones',
    price: 1099.0,
    originalPrice: 1199.0,
    image: '/Images/rom.jpg',
    rating: 5,
    reviews: 520,
  },
  {
    id: 4,
    name: 'Samsung Galaxy S24 Ultra 256GB',
    category: 'Smartphones',
    price: 1199.0,
    originalPrice: 1299.0,
    image: '/Images/comp3.jpg',
    rating: 5,
    reviews: 460,
  },
  {
    id: 5,
    name: 'Google Pixel 8 Pro 128GB',
    category: 'Smartphones',
    price: 899.0,
    originalPrice: 999.0,
    image: '/Images/comp.jpg',
    rating: 4,
    reviews: 312,
  },
  {
    id: 6,
    name: 'MacBook Pro 14 M3 512GB',
    category: 'Laptops',
    price: 1999.0,
    originalPrice: 2199.0,
    image: '/Images/lap.jpg',
    rating: 5,
    reviews: 231,
  },
  {
    id: 7,
    name: 'Dell XPS 13 Plus 512GB',
    category: 'Laptops',
    price: 1499.0,
    originalPrice: 1699.0,
    image: '/Images/comp2.jpg',
    rating: 4,
    reviews: 178,
  },
  {
    id: 8,
    name: 'ASUS ROG Zephyrus G14 RTX 4060',
    category: 'Gaming',
    price: 1599.0,
    originalPrice: 1799.0,
    image: '/Images/comp3.jpg',
    rating: 5,
    reviews: 154,
  },
  {
    id: 9,
    name: 'PlayStation 5 Slim Digital',
    category: 'Gaming',
    price: 449.99,
    originalPrice: 499.99,
    image: '/Images/comp.jpg',
    rating: 5,
    reviews: 498,
  },
  {
    id: 10,
    name: 'Xbox Series X 1TB',
    category: 'Gaming',
    price: 499.99,
    originalPrice: 549.99,
    image: '/Images/comp1.jpg',
    rating: 4,
    reviews: 301,
  },
  {
    id: 11,
    name: 'LG C3 OLED 55-inch 4K TV',
    category: 'TV & Media',
    price: 1299.0,
    originalPrice: 1499.0,
    image: '/Images/comp.jpg',
    rating: 5,
    reviews: 267,
  },
  {
    id: 12,
    name: 'Samsung QN90C Neo QLED 55-inch',
    category: 'TV & Media',
    price: 1399.0,
    originalPrice: 1599.0,
    image: '/Images/head.jpg',
    rating: 4,
    reviews: 188,
  },
  {
    id: 13,
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Headphones',
    price: 349.0,
    originalPrice: 399.0,
    image: '/Images/head.jpg',
    rating: 5,
    reviews: 621,
  },
  {
    id: 14,
    name: 'Bose QuietComfort Ultra',
    category: 'Headphones',
    price: 379.0,
    originalPrice: 429.0,
    image: '/Images/comp1.jpg',
    rating: 5,
    reviews: 287,
  },
  {
    id: 15,
    name: 'AirPods Pro 2nd Gen',
    category: 'Headphones',
    price: 249.0,
    originalPrice: 279.0,
    image: '/Images/comp2.jpg',
    rating: 4,
    reviews: 540,
  },
]

const parsePriceRange = (range) => {
  if (range === 'All Prices') {
    return { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY }
  }
  const [minRaw, maxRaw] = range.split(' - ')
  const min = Number(String(minRaw).replace(/[$,]/g, ''))
  const max = Number(String(maxRaw).replace(/[$,]/g, ''))
  return { min, max }
}

const Category = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { formatCurrency } = useCurrency()

  const categories = useMemo(
    () => ['All Categories', ...new Set(productsCatalog.map((p) => p.category))],
    []
  )

  const requestedCategory = location?.state?.category
  const initialCategory = categories.includes(requestedCategory) ? requestedCategory : 'All Categories'

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState('All Prices')
  const [sortBy, setSortBy] = useState('Popularity')
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    const nextCategory = categories.includes(requestedCategory)
      ? requestedCategory
      : 'All Categories'
    setSelectedCategory(nextCategory)
    setCurrentPage(1)
  }, [requestedCategory, categories])

  const priceRanges = [
    '$0 - $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    'All Prices',
  ]

  const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating']

  const filteredProducts = useMemo(() => {
    let filtered = [...productsCatalog]

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    const { min, max } = parsePriceRange(priceRange)
    filtered = filtered.filter((p) => p.price >= min && p.price <= max)

    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'Newest':
        filtered.sort((a, b) => b.id - a.id)
        break
      case 'Best Rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'Popularity':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews)
    }

    return filtered
  }, [selectedCategory, priceRange, sortBy])

  const bannerImage = location?.state?.image || null

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIdx = (safeCurrentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage)

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const startDisplay = filteredProducts.length === 0 ? 0 : startIdx + 1
  const endDisplay = Math.min(startIdx + itemsPerPage, filteredProducts.length)

  return (
    <div className="category-page">
      {bannerImage && (
        <div className="category-banner">
          <img src={bannerImage} alt={selectedCategory} />
        </div>
      )}

      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>All Categories</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value)
                setCurrentPage(1)
              }}
            >
              {priceRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="results-info">
            {selectedCategory} - Showing {startDisplay} - {endDisplay} of {filteredProducts.length} products
          </div>

          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid3x3 size={20} />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className={`products-section ${viewMode}`}>
        <div className={`products-grid ${viewMode}`}>
          {paginatedProducts.map((product) => {
            const discount =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate('/product', { state: { product } })}
                style={{ cursor: 'pointer' }}
              >
                {discount > 0 && <div className="discount-badge">{discount}%</div>}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <div className="category-label">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < product.rating ? 'filled' : ''} />
                      ))}
                    </div>
                    <span className="review-count">({product.reviews})</span>
                  </div>
                  <div className="price-section">
                    <span className="price">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {paginatedProducts.length === 0 && (
          <div className="empty-products">
            <h3>No products found</h3>
            <p>Try another category, price range, or sorting option.</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={safeCurrentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>

        {[...Array(totalPages)].slice(0, 5).map((_, i) => {
          const pageNum = i + 1
          return (
            <button
              key={pageNum}
              className={`pagination-btn ${safeCurrentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          )
        })}

        {totalPages > 5 && <span className="pagination-ellipsis">...</span>}

        {totalPages > 5 && (
          <button className="pagination-btn" onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </button>
        )}

        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={safeCurrentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default Category
