import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
      <Header />
      <Routes>
        <Route path="/" element={<HomeHero />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/signup" element={<Navigate to="/" />} />
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
