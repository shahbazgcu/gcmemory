const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/api/:id', categoryController.getCategoryById);
router.get('/:id', categoryController.getCategoryById);
// Admin routes
router.post('/', authenticateToken, authorizeRole('admin'), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRole('admin'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRole('admin'), categoryController.deleteCategory);

module.exports = router;