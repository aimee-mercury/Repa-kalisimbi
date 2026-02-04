import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '../Layout/Footer'
import '../../Styles/Category.scss'

const Category = () => {
  const navigate = useNavigate()
  // Sample products data
  const allProducts = [
    {
      id: 1,
      name: 'QuietComfort 45 Wireless Headphones',
      category: 'AUDIO',
      price: 329.99,
      originalPrice: 399.99,
      image: '/Images/comp1.jpg',
      rating: 5,
      reviews: 100,
      discount: 0,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 2,
      name: 'Orange Watch 12 High Quality Health Sensor',
      category: 'PHONE',
      price: 253.99,
      originalPrice: 349.99,
      image: '/Images/watch.jpg',
      rating: 5,
      reviews: 120,
      discount: 28,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 4,
      name: 'CanPro HERO10 Black Black Design 2023 4K',
      category: 'CAMERA',
      price: 1499.99,
      originalPrice: 1799.99,
      image: '/Images/comp3.jpg',
      rating: 5,
      reviews: 25,
      discount: 17,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 5,
      name: '2019 Smart Laptop 256 GB 13 inch Pro Chip',
      category: 'LAPTOP',
      price: 2099.99,
      originalPrice: 2499.99,
      image: '/Images/lap.jpg',
      rating: 5,
      reviews: 25,
      discount: 16,
    },
    {
      id: 6,
      name: 'Surface Laptop 4 XPS 13 Plus 640 FT Touchpad',
      category: 'LAPTOP',
      price: 2399.99,
      originalPrice: 2999.99,
      image: '/Images/comp.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 7,
      name: 'WH-1000XM4 Wireless Headphones High Qu...',
      category: 'AUDIO',
      price: 349.00,
      originalPrice: 449.00,
      image: '/Images/head.jpg',
      rating: 5,
      reviews: 100,
      discount: 22,
    },
    {
      id: 8,
      name: 'LT Phone RAM 16/256 GB Rose Gold Quantum',
      category: 'PHONE',
      price: 999.00,
      originalPrice: 1299.00,
      image: '/Images/rom.jpg',
      rating: 5,
      reviews: 50,
      discount: 23,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 9,
      name: 'Wosh Machine 11 KG Front Loading Steam...',
      category: 'HOME',
      price: 5699.00,
      originalPrice: 6999.00,
      image: '/Images/comp3.jpg',
      rating: 5,
      reviews: 100,
      discount: 18,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 10,
      name: 'Hero Watch 50 Series 8 Uloc Rubber Band 40...',
      category: 'WATCH',
      price: 899.00,
      originalPrice: 1099.00,
      image: '/Images/watch.jpg',
      rating: 5,
      reviews: 25,
      discount: 18,
    },
    {
      id: 11,
      name: 'Mobile Watch A Series GPS 7/44 45 mm Red...',
      category: 'PHONE',
      price: 999.00,
      originalPrice: 1299.00,
      image: '/Images/watch.jpg',
      rating: 5,
      reviews: 50,
      discount: 23,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 12,
      name: 'Gaming Laptop ZDY with M3 PRO 512 GB VRAM...',
      category: 'LAPTOP',
      price: 1659.00,
      originalPrice: 2099.00,
      image: '/Images/lap.jpg',
      rating: 5,
      reviews: 100,
      discount: 21,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 13,
      name: 'Tablet Pro 128 GB HD Pencil 128 Bytes...',
      category: 'TABLET',
      price: 129.00,
      originalPrice: 199.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 50,
      discount: 35,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 14,
      name: 'AG OLED85CX PUA 4K Smart OLED TV New...',
      category: 'TELEVISION',
      price: 2799.00,
      originalPrice: 3599.00,
      image: '/Images/comp.jpg',
      rating: 5,
      reviews: 25,
      discount: 22,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 15,
      name: 'Console Game Stick HD Wireless Bluetooth...',
      category: 'GAMING',
      price: 109.00,
      originalPrice: 199.00,
      image: '/Images/comp3.jpg',
      rating: 5,
      reviews: 50,
      discount: 45,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 16,
      name: 'Crystal 4K Smart 50" Block LED TV HD Qual...',
      category: 'TELEVISION',
      price: 8109.00,
      originalPrice: 9999.00,
      image: '/Images/comp.jpg',
      rating: 5,
      reviews: 100,
      discount: 19,
    },
    {
      id: 17,
      name: 'Mini Tablet Pro 16 Inch HD Pencil 128 Sys...',
      category: 'TABLET',
      price: 259.00,
      originalPrice: 329.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 21,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 18,
      name: '1345 Wireless Max HiFi Stereo Headphone Be...',
      category: 'AUDIO',
      price: 29.00,
      originalPrice: 69.00,
      image: '/Images/head.jpg',
      rating: 5,
      reviews: 50,
      discount: 58,
    },
    {
      id: 19,
      name: 'Sonic Station 15 Disc Edition with Console...',
      category: 'GAMING',
      price: 5299.99,
      originalPrice: 6999.99,
      image: '/Images/comp3.jpg',
      rating: 5,
      reviews: 100,
      discount: 24,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 20,
      name: 'Retro Portable Speaker HQ Wireless FT-12 on...',
      category: 'AUDIO',
      price: 49.00,
      originalPrice: 89.00,
      image: '/Images/comp1.jpg',
      rating: 5,
      reviews: 50,
      discount: 45,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp2.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp1.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
    {
      id: 3,
      name: 'Ultra Tablet Qweity HD 10.78 Series Low Price',
      category: 'TABLET',
      price: 799.00,
      originalPrice: 999.00,
      image: '/Images/comp.jpg',
      rating: 5,
      reviews: 100,
      discount: 20,
    },
  ]

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [priceRange, setPriceRange] = useState('$0 - $2,500')
  const [sortBy, setSortBy] = useState('Popularity')
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Extract unique categories
  const categories = ['All Categories', ...new Set(allProducts.map(p => p.category))]

  // Price ranges
  const priceRanges = [
    '$0 - $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    'All Prices',
  ]

  // Sort options
  const sortOptions = ['Popularity', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating']

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by price range
    if (priceRange !== 'All Prices') {
      const [minStr, maxStr] = priceRange.replace('$', '').split(' - ')
      const min = parseInt(minStr)
      const max = parseInt(maxStr)
      filtered = filtered.filter(p => p.price >= min && p.price <= max)
    }

    // Sort
    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'Price: High to Low':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'Newest':
        filtered.reverse()
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

  // Paginate
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage)

  return (
    <div className="category-page">
      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label>All Categories</label>
            <select value={selectedCategory} onChange={e => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select value={priceRange} onChange={e => {
              setPriceRange(e.target.value)
              setCurrentPage(1)
            }}>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="results-info">
            Showing 1 - {Math.min(itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
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

      {/* Products Grid */}
      <div className={`products-section ${viewMode}`}>
        <div className={`products-grid ${viewMode}`}>
          {paginatedProducts.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => navigate('/product', { state: { product } })}
              style={{ cursor: 'pointer' }}
            >
              {product.discount > 0 && (
                <div className="discount-badge">{product.discount}%</div>
              )}
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <div className="category-label">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < product.rating ? 'filled' : ''}
                      />
                    ))}
                  </div>
                  <span className="review-count">({product.reviews})</span>
                </div>
                <div className="price-section">
                  <span className="price">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} />
        </button>

        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const pageNum = i + 1
          return (
            <button
              key={pageNum}
              className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          )
        })}

        {totalPages > 5 && <span className="pagination-ellipsis">...</span>}

        {totalPages > 5 && (
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default Category
