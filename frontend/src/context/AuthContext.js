import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post('/api/auth/register', userData);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const message = 
        err.response && err.response.data.message 
          ? err.response.data.message 
          : 'Registration failed. Please try again.';
          
      setError(message);
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
      return { success: true };
    } catch (err) {
      const message = 
        err.response && err.response.data.message 
          ? err.response.data.message 
          : 'Login failed. Please check your credentials.';
          
      setError(message);
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
  };

  // Change password
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.put('/api/auth/change-password', passwordData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = 
        err.response && err.response.data.message 
          ? err.response.data.message 
          : 'Password change failed. Please try again.';
          
      setError(message);
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
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;