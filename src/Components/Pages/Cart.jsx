import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, Headset, ShieldCheck, Truck } from 'lucide-react'
import { CartContext } from '../../CartContext'
import { useCurrency } from '../../CurrencyContext'
import Footer from '../Layout/Footer'
import '../../Styles/Cart.scss'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, checkout } = useContext(CartContext)
  const { formatCurrency } = useCurrency()

  const handleContinueShopping = () => {
    navigate('/category')
  }

  const handleCheckout = () => {
    const didCheckout = checkout()
    if (didCheckout) {
      navigate('/')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-content">
            <div className="empty-icon">
              <ShoppingCart size={56} />
            </div>
            <h2>Your Cart is Empty</h2>
            <p>Start shopping to add items to your cart</p>
            <button className="btn-continue" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span>/</span>
          <span className="active">Cart</span>
        </div>

        <h1 className="cart-title">Your Cart</h1>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-table-header">
              <div className="col-product">PRODUCT</div>
              <div className="col-price">PRICE</div>
              <div className="col-qty">QTY</div>
              <div className="col-total">TOTAL</div>
              <div className="col-action">ACTION</div>
            </div>

            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="col-product" data-label="Product">
                    <div className="product-info">
                      <img src={item.image} alt={item.name} />
                      <div className="product-details">
                        <div className="category">{item.category || 'PRODUCT'}</div>
                        <h3>{item.name}</h3>
                        {item.selectedColor && <p className="variant">Variant: {item.selectedColor}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="col-price" data-label="Price">
                    {formatCurrency(item.price)}
                  </div>

                  <div className="col-qty" data-label="Qty">
                    <div className="quantity-control">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <input type="number" value={item.quantity} readOnly />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="col-total" data-label="Total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>

                  <div className="col-action" data-label="Action">
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove from cart"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <h3>Cart Summary</h3>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(getTotalPrice())}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span className="shipping">Free</span>
              </div>

              <div className="summary-row">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total:</span>
                <span className="total-price">{formatCurrency(getTotalPrice())}</span>
              </div>

              <button className="btn-checkout" onClick={handleCheckout}>Proceed to Checkout</button>
              <button className="btn-continue-shopping" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
            </div>

            <div className="features-section">
              <div className="feature">
                <div className="feature-icon">
                  <Headset size={22} />
                </div>
                <div className="feature-text">
                  <strong>Responsive</strong>
                  <p>Customer service 24/7</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <ShieldCheck size={22} />
                </div>
                <div className="feature-text">
                  <strong>Secure</strong>
                  <p>Certified marketplace since 2017</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <Truck size={22} />
                </div>
                <div className="feature-text">
                  <strong>Shipping</strong>
                  <p>Free, fast and reliable worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Cart
