const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getUserProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

// Admin routes
router.get('/users', authenticateToken, authorizeRole('admin'), authController.getAllUsers);
router.put('/users/role', authenticateToken, authorizeRole('admin'), authController.updateUserRole);

module.exports = router;