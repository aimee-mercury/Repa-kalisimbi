import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './CartContext'
import Header from './Components/Layout/Header'
import HomeHero from './Components/Pages/Landing'
import ProductPage from './Components/Pages/Product'
import Category from './Components/Pages/Category'
import Cart from './Components/Pages/Cart'
import Profile from './Components/Pages/Profile'


function App() {
  return (
    <CartProvider>
      <Router>
        <div className="landing-page">
          <Header />
          <Routes>
            <Route path="/" element={<HomeHero />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/category" element={<Category />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
