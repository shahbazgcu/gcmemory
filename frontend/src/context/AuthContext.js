import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children, showToast }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Set token in both state and localStorage
  const setAuthToken = (token) => {
    setToken(token);

    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Initialize auth state from localStorage on app load
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          const res = await api.get('/api/auth/profile');
          setUser(res.data.user);
        } catch (err) {
          console.error('Error loading user:', err);
          setAuthToken(null);
          setUser(null);
          if (showToast) showToast('Session expired. Please log in again.', 'warning');
        }
      }

      setLoading(false);
    };

    loadUser();
  }, [token, showToast]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/auth/register', userData);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      if (showToast) showToast('Registration successful! Welcome 🎉', 'success');
      return { success: true };
    } catch (err) {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Registration failed. Please try again.';

      setError(message);
      if (showToast) showToast(message, 'danger');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/auth/login', credentials);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      if (showToast) showToast('Login successful! 🎉', 'success');
      return { success: true };
    } catch (err) {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Login failed. Please check your credentials.';

      setError(message);
      if (showToast) showToast(message, 'danger');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    navigate('/');
    if (showToast) showToast('Logged out successfully 👋', 'info');
  };

  // Change password
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      await api.put('/api/auth/change-password', passwordData);
      setLoading(false);
      if (showToast) showToast('Password changed successfully ✅', 'success');
      return { success: true };
    } catch (err) {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Password change failed. Please try again.';

      setError(message);
      if (showToast) showToast(message, 'danger');
      setLoading(false);
      return { success: false, error: message };
    }
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        register,
        login,
        logout,
        changePassword,
        clearError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
