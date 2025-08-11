const express = require('express');
const imageController = require('../controllers/imageController');
const { authenticateToken, authorizeRole, optionalAuth } = require('../middleware/authMiddleware');
const { uploadSingleImage, processImage, handleMulterError } = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public/optional auth routes
router.get('/', optionalAuth, imageController.getAllImages);
router.get('/search', optionalAuth, imageController.searchImages);
router.get('/filter-options', imageController.getFilterOptions);
router.get('/:id', optionalAuth, imageController.getImageById);
router.get('/:id/related', imageController.getRelatedImages);

// User & Admin routes (require at least 'user' role)
router.post(
  '/',
  authenticateToken,
  authorizeRole('user', 'admin'),
  uploadSingleImage,
  handleMulterError,
  processImage,
  imageController.uploadImage
);

// Update and delete routes (owner or admin)
router.put('/:id', authenticateToken, imageController.updateImage);
router.delete('/:id', authenticateToken, imageController.deleteImage);

module.exports = router;