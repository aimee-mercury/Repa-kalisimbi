import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import '../../Styles/Auth.scss';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (signup(email, password, confirmPassword)) {
        navigate('/dashboard');
      } else {
        setError('Please fill in all fields correctly');
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
          <h2>Create an Account</h2>
          <p>Hello there, Let's start your journey with us.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSignUp}>
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

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="password-toggle">👁</span>
              </div>
            </div>

            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span>
                I accept the{' '}
                <a href="#" className="link">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="link">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-link"
            >
              Login now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
