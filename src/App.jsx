import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { CartProvider } from './CartContext'
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
import Analytics from './Components/Dashboard/Pages/Analytics'
import History from './Components/Dashboard/Pages/History'
import Notifications from './Components/Dashboard/Pages/Notifications'
import Settings from './Components/Dashboard/Pages/Settings'
import NewProduct from './Components/Dashboard/Pages/NewProduct'
import AddProduct from './Components/Dashboard/Pages/AddProduct'
import ProductReport from './Components/Dashboard/Pages/ProductReport'

// Protected route wrapper
const ProtectedRoute = ({ element }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }
  
  return isLoggedIn ? element : <Navigate to="/login" />;
};

function AppRoutes() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();
  const hideHeader = location.pathname.startsWith('/dashboard');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  // If not logged in, show login/signup pages without header
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // If logged in, show main app with header
  return (
    <div className="landing-page">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/history" element={<History />} />
        <Route path="/dashboard/notifications" element={<Notifications />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/products/new" element={<NewProduct />} />
        <Route path="/dashboard/products/add" element={<AddProduct />} />
        <Route path="/dashboard/products/report" element={<ProductReport />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route path="/signup" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
