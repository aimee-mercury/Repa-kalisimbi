import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error('Failed to load user from localStorage:', e);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple validation (in production, this would call a backend API)
    if (email && password) {
      const userData = {
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const signup = (email, password, confirmPassword) => {
    // Simple validation (in production, this would call a backend API)
    if (email && password && password === confirmPassword) {
      const userData = {
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
