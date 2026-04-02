import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardHeader from '../../Layout/Layout'
import Sidebar from '../../Layout/Sidebar'
import '../../../Styles/Home.scss'
import '../../../Styles/NewProduct.scss'

const LANDING_PRODUCTS_KEY = 'landingPostedProducts'
const DASHBOARD_PRODUCTS_KEY = 'dashboardProducts'
const SOURCE_SECTIONS = [
  'Best Deals',
  'Top !o Selected',
  'Popular Search',
  'Hot Sale',
  'Recently',
]

const fallbackProducts = []

export default function NewProduct() {
  const PRODUCTS_PER_PAGE = 4
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState('popularity')
  const [filterKey, setFilterKey] = useState('all')
  const [productEditor, setProductEditor] = useState(null)
  const [productEditorMessage, setProductEditorMessage] = useState({
    type: '',
    text: '',
  })
  const [pageMessage, setPageMessage] = useState({ type: '', text: '' })

  const readStorageArray = useCallback((key) => {
    const raw = localStorage.getItem(key)
    if (raw === null) return { exists: false, value: [] }

    try {
      const parsed = JSON.parse(raw)
      return { exists: true, value: Array.isArray(parsed) ? parsed : [] }
    } catch {
      return { exists: true, value: [] }
    }
  }, [])

  const loadDashboardProducts = useCallback(() => {
    const stored = readStorageArray(DASHBOARD_PRODUCTS_KEY)
    return stored.exists ? stored.value : fallbackProducts
  }, [readStorageArray])

  const [products, setProducts] = useState(() => loadDashboardProducts())
  const [homePosts, setHomePosts] = useState(
    () => readStorageArray(LANDING_PRODUCTS_KEY).value,
  )
  const [imageEditor, setImageEditor] = useState(null)
  const imageUploadRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const title = useMemo(() => {
    const selectedSection =
      location.state?.sourceSection ||
      products[0]?.sourceSection ||
      'Best Deals'
    return `${selectedSection} Products`
  }, [location.state, products])

  const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`
  const parsePriceValue = (value) =>
    Number(String(value).replace(/[^0-9.]/g, '')) || 0
  const isSoldOut = useCallback(
    (product) =>
      Number(product.stock || 0) <= 0 ||
      String(product.status || '')
        .toUpperCase()
        .includes('OUT'),
    [],
  )

  const safeSetStorage = (key, value) => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  }

  const safeSetStorageDetailed = (key, value) => {
    try {
      localStorage.setItem(key, value)
      return { ok: true, error: null }
    } catch (error) {
      return { ok: false, error }
    }
  }

  const normalizeImages = (item) => {
    if (Array.isArray(item?.images) && item.images.length > 0)
      return item.images
    if (item?.image) return [item.image]
    return []
  }

  const getPrimaryImage = (item) => {
    const images = normalizeImages(item)
    return item?.image || images[0] || ''
  }

  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const maxSize = 900
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.floor(img.width * scale))
          canvas.height = Math.max(1, Math.floor(img.height * scale))
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve('')
            return
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.72))
        }
        img.onerror = reject
        img.src = String(reader.result || '')
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const openImageEditor = (source, item) => {
    const images = normalizeImages(item)
    const primary = getPrimaryImage(item)
    const ordered =
      primary && images.includes(primary)
        ? [primary, ...images.filter((img) => img !== primary)]
        : images
    setImageEditor({
      source,
      id: item?.id,
      name: item?.name || 'Product',
      images: ordered,
    })

    if (imageUploadRef.current) imageUploadRef.current.value = ''
  }

  const closeImageEditor = () => {
    setImageEditor(null)
    if (imageUploadRef.current) imageUploadRef.current.value = ''
  }

  const updateEditorImages = (updater) => {
    setImageEditor((prev) => {
      if (!prev) return prev
      const nextImages = updater(prev.images)
      return { ...prev, images: nextImages }
    })
  }

  const handleEditorPickImage = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const uploaded = await compressImage(file)
      if (!uploaded) return
      updateEditorImages((prev) =>
        [uploaded, ...prev.filter((img) => img !== uploaded)].slice(0, 6),
      )
    } catch {
      // ignore upload errors in the modal
    } finally {
      event.target.value = ''
    }
  }

  const handleEditorRemoveImage = (imageToRemove) => {
    updateEditorImages((prev) => prev.filter((img) => img !== imageToRemove))
  }

  const handleEditorSetPrimary = (primary) => {
    updateEditorImages((prev) => {
      if (!prev.includes(primary)) return prev
      return [primary, ...prev.filter((img) => img !== primary)]
    })
  }

  const persistImagesForId = (id, images) => {
    const primary = images[0] || ''

    const dashboardStored = readStorageArray(DASHBOARD_PRODUCTS_KEY)
    const dashboardProducts = dashboardStored.exists
      ? dashboardStored.value
      : products
    const landingProducts = readStorageArray(LANDING_PRODUCTS_KEY).value

    const nextDashboardProducts = dashboardProducts.map((product) =>
      product.id === id
        ? {
            ...product,
            image: primary || product.image || '',
            images,
          }
        : product,
    )

    const nextLandingProducts = landingProducts.map((product) =>
      product.id === id
        ? {
            ...product,
            image: primary || product.image || '',
            images,
          }
        : product,
    )

    safeSetStorage(
      DASHBOARD_PRODUCTS_KEY,
      JSON.stringify(nextDashboardProducts),
    )
    safeSetStorage(LANDING_PRODUCTS_KEY, JSON.stringify(nextLandingProducts))
    setProducts(nextDashboardProducts)
    setHomePosts(nextLandingProducts)
    window.dispatchEvent(new Event('storage'))
  }

  const handleSaveEditor = () => {
    if (!imageEditor?.id) return
    persistImagesForId(imageEditor.id, imageEditor.images)
    closeImageEditor()
  }

  const handleAddToHome = (product) => {
    const currentLandingProducts = JSON.parse(
      localStorage.getItem(LANDING_PRODUCTS_KEY) || '[]',
    )

    const images = normalizeImages(product)
    const primaryImage = getPrimaryImage(product)

    const landingProduct = {
      id: product.id || `home-product-${currentLandingProducts.length + 1}`,
      name: product.name,
      image: primaryImage,
      images,
      price: Number(product.price) || 0,
      stock: Number(product.stock || 0),
      rating: 5,
      sourceSection:
        product.sourceSection || location.state?.sourceSection || 'Best Deals',
      onSale: (product.sourceSection || '').toLowerCase().includes('hot'),
    }

    safeSetStorage(
      LANDING_PRODUCTS_KEY,
      JSON.stringify(
        [
          landingProduct,
          ...currentLandingProducts.filter((p) => p.id !== landingProduct.id),
        ].slice(0, 50),
      ),
    )

    navigate('/', { state: { homeSection: landingProduct.sourceSection } })
  }

  const openProductEditor = (product) => {
    setProductEditor({
      id: product?.id,
      name: String(product?.name || ''),
      description: String(product?.description || ''),
      category: String(product?.category || ''),
      deviceType: String(product?.deviceType || ''),
      storage: String(product?.storage || ''),
      postalCode: String(product?.postalCode || ''),
      sku: String(product?.sku || ''),
      sourceSection: String(
        product?.sourceSection ||
          location.state?.sourceSection ||
          SOURCE_SECTIONS[0],
      ),
      oldPrice: String(product?.oldPrice ?? ''),
      price: String(product?.price ?? ''),
      stock: String(product?.stock ?? ''),
      discountType: String(product?.discountType || ''),
    })
    setProductEditorMessage({ type: '', text: '' })
    setPageMessage({ type: '', text: '' })
  }

  const closeProductEditor = () => {
    setProductEditor(null)
    setProductEditorMessage({ type: '', text: '' })
  }

  const handleProductEditorChange = (key) => (event) => {
    const value = event.target.value
    setProductEditor((prev) => (prev ? { ...prev, [key]: value } : prev))
    setProductEditorMessage({ type: '', text: '' })
  }

  const handleSaveProductEditor = () => {
    if (!productEditor?.id) return

    const name = String(productEditor.name || '').trim()
    if (!name) {
      setProductEditorMessage({ type: 'error', text: 'Name is required.' })
      return
    }

    const price = parsePriceValue(productEditor.price)
    if (price <= 0) {
      setProductEditorMessage({ type: 'error', text: 'Enter a valid price.' })
      return
    }

    const oldPriceRaw = parsePriceValue(productEditor.oldPrice)
    const oldPrice = oldPriceRaw > 0 ? oldPriceRaw : price
    const stock =
      Number(String(productEditor.stock || '').replace(/[^0-9]/g, '')) || 0
    const status = stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'

    const updatedFields = {
      name,
      description: String(productEditor.description || '').trim(),
      category: String(productEditor.category || '').trim(),
      deviceType: String(productEditor.deviceType || '').trim(),
      storage: String(productEditor.storage || '').trim(),
      postalCode: String(productEditor.postalCode || '').trim(),
      sku: String(productEditor.sku || '').trim(),
      sourceSection: String(productEditor.sourceSection || '').trim(),
      discountType: String(productEditor.discountType || '').trim(),
      oldPrice,
      price,
      stock,
      status,
      updatedAt: new Date().toISOString(),
    }

    try {
      const dashboardStored = readStorageArray(DASHBOARD_PRODUCTS_KEY)
      const dashboardProducts = dashboardStored.exists
        ? dashboardStored.value
        : products
      const landingProducts = readStorageArray(LANDING_PRODUCTS_KEY).value

      const nextDashboardProducts = dashboardProducts.map((item) =>
        item.id === productEditor.id ? { ...item, ...updatedFields } : item,
      )

      const nextLandingProducts = landingProducts.map((item) =>
        item.id === productEditor.id
          ? {
              ...item,
              name: updatedFields.name,
              price: updatedFields.price,
              stock: updatedFields.stock,
              sourceSection: updatedFields.sourceSection || item.sourceSection,
              onSale: String(
                updatedFields.sourceSection || item.sourceSection || '',
              )
                .toLowerCase()
                .includes('hot'),
            }
          : item,
      )

      const dashboardResult = safeSetStorageDetailed(
        DASHBOARD_PRODUCTS_KEY,
        JSON.stringify(nextDashboardProducts),
      )
      const landingResult = safeSetStorageDetailed(
        LANDING_PRODUCTS_KEY,
        JSON.stringify(nextLandingProducts),
      )

      if (!dashboardResult.ok || !landingResult.ok) {
        setProductEditorMessage({
          type: 'error',
          text: 'Could not save to browser storage. Try removing some products/images then save again.',
        })
      }

      setProducts(nextDashboardProducts)
      setHomePosts(nextLandingProducts)
      setPageMessage({ type: 'success', text: 'Product updated.' })
      closeProductEditor()
      window.dispatchEvent(new Event('storage'))
    } catch {
      setProductEditorMessage({
        type: 'error',
        text: 'Update failed. Try again.',
      })
    }
  }

  const handleDeleteProduct = (productId) => {
    try {
      const dashboardStored = readStorageArray(DASHBOARD_PRODUCTS_KEY)
      const dashboardProducts = dashboardStored.exists
        ? dashboardStored.value
        : products
      const landingProducts = readStorageArray(LANDING_PRODUCTS_KEY).value

      const nextDashboardProducts = dashboardProducts.filter(
        (item) => item.id !== productId,
      )
      const nextLandingProducts = landingProducts.filter(
        (item) => item.id !== productId,
      )

      safeSetStorage(
        DASHBOARD_PRODUCTS_KEY,
        JSON.stringify(nextDashboardProducts),
      )
      safeSetStorage(LANDING_PRODUCTS_KEY, JSON.stringify(nextLandingProducts))
      setProducts(nextDashboardProducts)
      setHomePosts(nextLandingProducts)
      setProductEditor((current) =>
        current?.id === productId ? null : current,
      )
      setProductEditorMessage({ type: '', text: '' })
      window.dispatchEvent(new Event('storage'))
    } catch {
      // Keep the current UI if deletion fails.
    }
  }

  const soldOutCount = useMemo(
    () =>
      products.reduce(
        (count, product) => count + (isSoldOut(product) ? 1 : 0),
        0,
      ),
    [isSoldOut, products],
  )

  const inStockCount = useMemo(
    () =>
      products.reduce(
        (count, product) => count + (!isSoldOut(product) ? 1 : 0),
        0,
      ),
    [isSoldOut, products],
  )

  const handleRemoveSoldOut = () => {
    if (soldOutCount === 0) return
    const shouldRemove = window.confirm(
      `Remove ${soldOutCount} sold out product(s) from the dashboard?`,
    )
    if (!shouldRemove) return

    try {
      const dashboardStored = readStorageArray(DASHBOARD_PRODUCTS_KEY)
      const dashboardProducts = dashboardStored.exists
        ? dashboardStored.value
        : products
      const landingProducts = readStorageArray(LANDING_PRODUCTS_KEY).value

      const soldOutIds = new Set(
        dashboardProducts.filter(isSoldOut).map((item) => item.id),
      )
      const nextDashboardProducts = dashboardProducts.filter(
        (item) => !soldOutIds.has(item.id),
      )
      const nextLandingProducts = landingProducts.filter(
        (item) => !soldOutIds.has(item.id),
      )

      safeSetStorage(
        DASHBOARD_PRODUCTS_KEY,
        JSON.stringify(nextDashboardProducts),
      )
      safeSetStorage(LANDING_PRODUCTS_KEY, JSON.stringify(nextLandingProducts))
      setProducts(nextDashboardProducts)
      setHomePosts(nextLandingProducts)
      setProductEditor(null)
      setProductEditorMessage({ type: '', text: '' })
      window.dispatchEvent(new Event('storage'))
    } catch {
      // Keep the current UI if deletion fails.
    }
  }

  useEffect(() => {
    const syncProducts = () => {
      setProducts(loadDashboardProducts())
    }

    syncProducts()
    window.addEventListener('storage', syncProducts)
    return () => window.removeEventListener('storage', syncProducts)
  }, [loadDashboardProducts])

  useEffect(() => {
    const syncHomePosts = () => {
      setHomePosts(readStorageArray(LANDING_PRODUCTS_KEY).value)
    }

    syncHomePosts()
    window.addEventListener('storage', syncHomePosts)
    window.addEventListener('focus', syncHomePosts)
    return () => {
      window.removeEventListener('storage', syncHomePosts)
      window.removeEventListener('focus', syncHomePosts)
    }
  }, [readStorageArray])

  const postedIds = useMemo(
    () => new Set(homePosts.map((item) => item.id)),
    [homePosts],
  )

  const handleRemoveFromHome = (productId) => {
    const shouldRemove = window.confirm('Remove this product from Home?')
    if (!shouldRemove) return

    const nextHomePosts = homePosts.filter((item) => item.id !== productId)
    safeSetStorage(LANDING_PRODUCTS_KEY, JSON.stringify(nextHomePosts))
    setHomePosts(nextHomePosts)
    window.dispatchEvent(new Event('storage'))
  }

  const filteredProducts = useMemo(() => {
    if (filterKey === 'in') return products.filter((p) => !isSoldOut(p))
    if (filterKey === 'out') return products.filter((p) => isSoldOut(p))
    return products
  }, [filterKey, isSoldOut, products])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]

    const getCreatedAt = (product) => {
      if (product?.createdAt) {
        const date = new Date(product.createdAt)
        if (!Number.isNaN(date.getTime())) return date.getTime()
      }

      const match = String(product?.id || '').match(/(\d{10,})$/)
      if (match) {
        const timestamp = Number(match[1])
        if (Number.isFinite(timestamp)) return timestamp
      }

      return 0
    }

    if (sortKey === 'newest') {
      list.sort((a, b) => getCreatedAt(b) - getCreatedAt(a))
      return list
    }

    if (sortKey === 'trending') {
      list.sort((a, b) => Number(b?.soldUnits || 0) - Number(a?.soldUnits || 0))
      return list
    }

    // popularity (default): soldUnits then rating then price
    list.sort((a, b) => {
      const soldDiff = Number(b?.soldUnits || 0) - Number(a?.soldUnits || 0)
      if (soldDiff !== 0) return soldDiff
      const ratingDiff = Number(b?.rating || 0) - Number(a?.rating || 0)
      if (ratingDiff !== 0) return ratingDiff
      return Number(b?.price || 0) - Number(a?.price || 0)
    })
    return list
  }, [filteredProducts, sortKey])

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE),
  )
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const currentProducts = sortedProducts.slice(
    (safeCurrentPage - 1) * PRODUCTS_PER_PAGE,
    safeCurrentPage * PRODUCTS_PER_PAGE,
  )

  return (
    <div className='dashboard-shell'>
      <Sidebar />
      <div className='dashboard-main'>
        <DashboardHeader />
        <div className='new-product-page'>
          <div className='new-product-head'>
            <div>
              <h1>{title}</h1>
              <p>
                {sortedProducts.length === 0
                  ? 'No products available yet.'
                  : `Showing ${(safeCurrentPage - 1) * PRODUCTS_PER_PAGE + 1}-${Math.min(
                      safeCurrentPage * PRODUCTS_PER_PAGE,
                      sortedProducts.length,
                    )} of ${sortedProducts.length} product result(s)`}
              </p>
            </div>
            <div className='sort-box'>
              <span>Show by</span>
              <button
                type='button'
                className={sortKey === 'popularity' ? 'active-sort' : ''}
                onClick={() => setSortKey('popularity')}
              >
                Popularity
              </button>
              <button
                type='button'
                className={sortKey === 'newest' ? 'active-sort' : ''}
                onClick={() => setSortKey('newest')}
              >
                Newest
              </button>
              <button
                type='button'
                className={sortKey === 'trending' ? 'active-sort' : ''}
                onClick={() => setSortKey('trending')}
              >
                Trending
              </button>
            </div>
          </div>

          <div className='products-toolbar'>
            <div className='toolbar-stats'>
              <span>In stock: {inStockCount}</span>
              <span>Sold out: {soldOutCount}</span>
            </div>
            {pageMessage.text && (
              <div className={`page-message ${pageMessage.type}`}>
                {pageMessage.text}
              </div>
            )}
            <div className='toolbar-controls'>
              <label htmlFor='product-filter'>Filter</label>
              <select
                id='product-filter'
                value={filterKey}
                onChange={(event) => {
                  setFilterKey(event.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value='all'>All</option>
                <option value='in'>In Stock</option>
                <option value='out'>Sold Out</option>
              </select>
            </div>
            <button
              type='button'
              className='remove-soldout-btn'
              onClick={handleRemoveSoldOut}
              disabled={soldOutCount === 0}
              title={
                soldOutCount === 0
                  ? 'No sold out products to remove.'
                  : 'Remove sold out products'
              }
            >
              Remove Sold Out
            </button>
          </div>

          <section className='home-posts-section'>
            <div className='home-posts-head'>
              <div>
                <h2>Posted to Home</h2>
                <p>
                  {homePosts.length} product(s) currently visible on the website
                  home page.
                </p>
              </div>
              <button
                type='button'
                className='clear-home-btn'
                disabled={homePosts.length === 0}
                onClick={() => {
                  const shouldClear = window.confirm(
                    'Remove ALL posted Home products?',
                  )
                  if (!shouldClear) return
                  safeSetStorage(LANDING_PRODUCTS_KEY, JSON.stringify([]))
                  setHomePosts([])
                  window.dispatchEvent(new Event('storage'))
                }}
              >
                Clear Home Posts
              </button>
            </div>

            {homePosts.length === 0 ? (
              <div className='home-posts-empty'>
                <p>
                  Nothing posted to Home yet. Use “Add to Home” on a product
                  below.
                </p>
              </div>
            ) : (
              <div className='home-posts-list'>
                {homePosts.slice(0, 24).map((item) => (
                  <article className='home-post-row' key={item.id}>
                    {getPrimaryImage(item) ? (
                      <img
                        className='home-post-image'
                        src={getPrimaryImage(item)}
                        alt={item.name || 'Posted product'}
                      />
                    ) : (
                      <div className='home-post-image image-placeholder'>
                        No image
                      </div>
                    )}
                    <div className='home-post-info'>
                      <div className='home-post-meta'>
                        <span className='home-post-tag'>
                          {item.sourceSection || 'Best Deals'}
                        </span>
                        <span className='home-post-stock'>
                          Stock: {Number(item.stock ?? 0)}
                        </span>
                      </div>
                      <h3>{item.name || 'Untitled product'}</h3>
                      <p className='home-post-price'>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className='home-post-actions'>
                      <button
                        type='button'
                        className='home-post-edit-btn'
                        onClick={() => openImageEditor('home', item)}
                      >
                        Edit Images
                      </button>
                      <button
                        type='button'
                        className='home-post-remove-btn'
                        onClick={() => handleRemoveFromHome(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
                {homePosts.length > 24 && (
                  <p className='home-posts-note'>
                    Showing first 24 posts. Remove posts you don’t need.
                  </p>
                )}
              </div>
            )}
          </section>

          <div className='product-list'>
            {currentProducts.length === 0 ? (
              <div className='empty-products-state'>
                <h2>No products found</h2>
                <p>Add a new product from the dashboard to see it here.</p>
              </div>
            ) : (
              currentProducts.map((product) => {
                const soldOut = isSoldOut(product)

                return (
                  <article
                    className={`product-row ${soldOut ? 'sold-out-row' : ''}`}
                    key={product.id}
                  >
                    {getPrimaryImage(product) ? (
                      <img
                        className='product-image'
                        src={getPrimaryImage(product)}
                        alt={product.name}
                      />
                    ) : (
                      <div className='product-image image-placeholder'>
                        No image
                      </div>
                    )}

                    <div className='product-info'>
                      <div className='meta-line'>
                        <span className='stars'>★★★★★</span>
                        <span className='sku'>
                          {product.sku || 'SKU 1231452485251'}
                        </span>
                        <span className='source-tag'>
                          {product.sourceSection ||
                            location.state?.sourceSection ||
                            'Best Deals'}
                        </span>
                      </div>
                      <h2>{product.name}</h2>
                      <ul>
                        <li>
                          {product.description ||
                            'High-performance electronic device.'}
                        </li>
                        <li>
                          Postal code: {product.postalCode || 'Not provided'}
                        </li>
                        <li>Free delivery and warranty support available.</li>
                      </ul>
                    </div>

                    <div className='product-right'>
                      <div className='icons-line'>
                        <span>Free Delivery</span>
                        <span>Voucher 35%</span>
                        {postedIds.has(product.id) && (
                          <span className='posted-tag'>Posted</span>
                        )}
                        <span className={`stock ${soldOut ? 'out' : 'in'}`}>
                          {product.status ||
                            (soldOut ? 'OUT OF STOCK' : 'IN STOCK')}
                        </span>
                      </div>

                      <div className='price-line'>
                        <span className='old-price'>
                          {formatPrice(product.oldPrice || product.price)}
                        </span>
                        <strong>{formatPrice(product.price)}</strong>
                      </div>

                      <div className='actions-line'>
                        {!soldOut && (
                          <button
                            type='button'
                            className='cart-btn'
                            onClick={() => handleAddToHome(product)}
                          >
                            {postedIds.has(product.id)
                              ? 'Update Home'
                              : 'Add to Home'}
                          </button>
                        )}
                        {postedIds.has(product.id) && (
                          <button
                            type='button'
                            className='remove-home-btn'
                            onClick={() => handleRemoveFromHome(product.id)}
                          >
                            Remove Home
                          </button>
                        )}
                        <button
                          type='button'
                          className='edit-product-btn'
                          onClick={() => openProductEditor(product)}
                        >
                          Edit Product
                        </button>
                        <button
                          type='button'
                          className='edit-images-btn'
                          onClick={() => openImageEditor('dashboard', product)}
                        >
                          Edit Images
                        </button>
                        <button
                          type='button'
                          className={
                            soldOut
                              ? 'delete-btn sold-out-delete-btn'
                              : 'delete-btn'
                          }
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          {soldOut ? 'Remove Sold Out' : 'Delete Product'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })
            )}
          </div>

          <div className='pagination'>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1
              return (
                <button
                  key={page}
                  type='button'
                  className={safeCurrentPage === page ? 'active-page' : ''}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            })}
          </div>

          {productEditor && (
            <div
              className='product-editor-backdrop'
              onClick={(event) => {
                if (event.target === event.currentTarget) closeProductEditor()
              }}
              role='presentation'
            >
              <div className='product-editor-modal'>
                <div className='product-editor-head'>
                  <div>
                    <h2>Edit Product</h2>
                    <p>{productEditor.name || 'Product'}</p>
                  </div>
                  <button
                    type='button'
                    className='product-editor-close'
                    onClick={closeProductEditor}
                    aria-label='Close'
                  >
                    {'\u00D7'}
                  </button>
                </div>

                <div className='product-editor-body'>
                  <div className='product-editor-grid'>
                    <label>
                      <span>Name</span>
                      <input
                        type='text'
                        value={productEditor.name}
                        onChange={handleProductEditorChange('name')}
                      />
                    </label>

                    <label className='span-2'>
                      <span>Description</span>
                      <textarea
                        rows={3}
                        value={productEditor.description}
                        onChange={handleProductEditorChange('description')}
                      />
                    </label>

                    <label>
                      <span>SKU</span>
                      <input
                        type='text'
                        value={productEditor.sku}
                        onChange={handleProductEditorChange('sku')}
                      />
                    </label>

                    <label>
                      <span>Category</span>
                      <input
                        type='text'
                        value={productEditor.category}
                        onChange={handleProductEditorChange('category')}
                      />
                    </label>

                    <label>
                      <span>Device Type</span>
                      <select
                        value={productEditor.deviceType}
                        onChange={handleProductEditorChange('deviceType')}
                      >
                        <option value=''>Select</option>
                        <option value='Laptop'>Laptop</option>
                        <option value='Desktop'>Desktop</option>
                        <option value='Tablet'>Tablet</option>
                      </select>
                    </label>

                    <label>
                      <span>Storage</span>
                      <input
                        type='text'
                        value={productEditor.storage}
                        onChange={handleProductEditorChange('storage')}
                      />
                    </label>

                    <label>
                      <span>Postal Code</span>
                      <input
                        type='text'
                        value={productEditor.postalCode}
                        onChange={handleProductEditorChange('postalCode')}
                      />
                    </label>

                    <label>
                      <span>Section</span>
                      <select
                        value={productEditor.sourceSection}
                        onChange={handleProductEditorChange('sourceSection')}
                      >
                        {(SOURCE_SECTIONS.includes(productEditor.sourceSection)
                          ? SOURCE_SECTIONS
                          : [
                              productEditor.sourceSection,
                              ...SOURCE_SECTIONS,
                            ].filter(Boolean)
                        ).map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Old Price</span>
                      <input
                        type='text'
                        value={productEditor.oldPrice}
                        onChange={handleProductEditorChange('oldPrice')}
                      />
                    </label>

                    <label>
                      <span>Price</span>
                      <input
                        type='text'
                        value={productEditor.price}
                        onChange={handleProductEditorChange('price')}
                      />
                    </label>

                    <label>
                      <span>Stock</span>
                      <input
                        type='text'
                        value={productEditor.stock}
                        onChange={handleProductEditorChange('stock')}
                      />
                    </label>

                    <label>
                      <span>Discount Type</span>
                      <input
                        type='text'
                        value={productEditor.discountType}
                        onChange={handleProductEditorChange('discountType')}
                      />
                    </label>
                  </div>

                  {productEditorMessage.text && (
                    <p
                      className={`product-editor-message ${productEditorMessage.type}`}
                    >
                      {productEditorMessage.text}
                    </p>
                  )}
                </div>

                <div className='product-editor-actions'>
                  <button
                    type='button'
                    className='product-editor-save'
                    onClick={handleSaveProductEditor}
                  >
                    Save Changes
                  </button>
                  <button
                    type='button'
                    className='product-editor-cancel'
                    onClick={closeProductEditor}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {imageEditor && (
            <div
              className='image-editor-backdrop'
              onClick={(event) => {
                if (event.target === event.currentTarget) closeImageEditor()
              }}
              role='presentation'
            >
              <div className='image-editor-modal'>
                <div className='image-editor-head'>
                  <div>
                    <h2>Edit Images</h2>
                    <p>
                      {imageEditor.name} (
                      {imageEditor.source === 'home'
                        ? 'Home post'
                        : 'Dashboard product'}
                      )
                    </p>
                  </div>
                  <button
                    type='button'
                    className='image-editor-close'
                    onClick={closeImageEditor}
                    aria-label='Close'
                  >
                    {'\u00D7'}
                  </button>
                </div>

                <div className='image-editor-body'>
                  <div className='image-editor-preview'>
                    {imageEditor.images[0] ? (
                      <img src={imageEditor.images[0]} alt='Primary' />
                    ) : (
                      <div className='image-editor-empty'>
                        No image selected
                      </div>
                    )}
                  </div>

                  <div className='image-editor-thumbs'>
                    {imageEditor.images.map((img, index) => (
                      <div
                        className={`editor-thumb ${index === 0 ? 'primary' : ''}`}
                        key={`${img}-${index}`}
                      >
                        <button
                          type='button'
                          className='editor-thumb-btn'
                          onClick={() => handleEditorSetPrimary(img)}
                          title='Set as primary'
                        >
                          <img src={img} alt={`Thumb ${index + 1}`} />
                        </button>
                        <button
                          type='button'
                          className='editor-thumb-remove'
                          onClick={() => handleEditorRemoveImage(img)}
                          title='Remove image'
                        >
                          {'\u00D7'}
                        </button>
                      </div>
                    ))}

                    <button
                      type='button'
                      className='editor-add-thumb'
                      onClick={() => imageUploadRef.current?.click()}
                      title='Add image'
                    >
                      +
                    </button>
                    <input
                      ref={imageUploadRef}
                      type='file'
                      accept='image/*'
                      onChange={handleEditorPickImage}
                      className='editor-file-input'
                    />
                  </div>
                </div>

                <div className='image-editor-actions'>
                  <button
                    type='button'
                    className='image-editor-save'
                    onClick={handleSaveEditor}
                  >
                    Save
                  </button>
                  <button
                    type='button'
                    className='image-editor-cancel'
                    onClick={closeImageEditor}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
