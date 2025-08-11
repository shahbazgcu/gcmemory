const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

// Middleware to validate token and set user in req
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check user roles
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access forbidden. You do not have the required permissions.' 
      });
    }

    next();
  };
};

// Optional authentication - doesn't block requests without tokens
// Used for routes that can be accessed by both authenticated and unauthenticated users
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      // No token, proceed as unauthenticated user
      req.user = null;
      return next();
    }

    // If token exists, verify it
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret');
    const user = await User.findById(decoded.userId);

    req.user = user || null;
    next();
  } catch (error) {
    // Invalid token, proceed as unauthenticated user
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  optionalAuth
};