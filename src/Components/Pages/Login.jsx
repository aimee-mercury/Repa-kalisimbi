import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import '../../Styles/Auth.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/');
      } else {
        setError('Please enter both email and password');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <img src="/Images/comp.jpg" alt="Shopping" />
        <div className="overlay"></div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2>Welcome Back!</h2>
          <p>Get access to your Orders, Wishlist Easily</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="password-toggle">👁</span>
              </div>
            </div>

            <div className="form-row">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="btn-link"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
