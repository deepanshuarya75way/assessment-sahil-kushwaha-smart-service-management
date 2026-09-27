import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ssm_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile on startup if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch (err) {
          console.error('[Auth] Token validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;
        localStorage.setItem('ssm_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Register handler
  const register = async (name, email, password, role = 'USER') => {
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;
        localStorage.setItem('ssm_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  // Logout handler - clears session and redirects directly to public home page
  const logout = () => {
    localStorage.removeItem('ssm_token');
    setToken(null);
    setUser(null);
    window.location.replace('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
