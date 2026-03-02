import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { CartProvider } from './CartContext'
import { CurrencyProvider } from './CurrencyContext'
import { AuthProvider, AuthContext } from './AuthContext'
import Header from './Components/Layout/Header'
import HomeHero from './Components/Pages/Landing'
import ProductPage from './Components/Pages/Product'
import Category from './Components/Pages/Category'
import Cart from './Components/Pages/Cart'
import Profile from './Components/Pages/Profile'
import Login from './Components/Pages/Login'
import SignUp from './Components/Pages/SignUp'
import Dashboard from './Components/Dashboard/Home'
import Notifications from './Components/Dashboard/Pages/Notifications'
import Settings from './Components/Dashboard/Pages/Settings'
import NewProduct from './Components/Dashboard/Pages/NewProduct'
import AddProduct from './Components/Dashboard/Pages/AddProduct'
import ProductReport from './Components/Dashboard/Pages/ProductReport'

// Protected route wrapper
const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }
  
  return isLoggedIn ? element : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

function AppRoutes() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();
  const hideHeader =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/login' ||
    location.pathname === '/signup';

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div className="landing-page">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:categoryKey" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route
          path="/dashboard/notifications"
          element={<ProtectedRoute element={<Notifications />} />}
        />
        <Route path="/dashboard/settings" element={<ProtectedRoute element={<Settings />} />} />
        <Route
          path="/dashboard/products/new"
          element={<ProtectedRoute element={<NewProduct />} />}
        />
        <Route
          path="/dashboard/products/add"
          element={<ProtectedRoute element={<AddProduct />} />}
        />
        <Route
          path="/dashboard/products/report"
          element={<ProtectedRoute element={<ProductReport />} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CurrencyProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CurrencyProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
