const fs = require('fs');
const path = require('path');
const Memory = require('../models/memoryModel');

// Get all images with pagination
exports.getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const images = await Memory.getAll(limit, offset);
    const total = await Memory.getTotal();

    res.status(200).json({
      images,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all images error:', error);
    res.status(500).json({ message: 'Server error while fetching images.' });
  }
};

// Get image by ID
exports.getImageById = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await Memory.findById(imageId);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }
    
    res.status(200).json({ image });
  } catch (error) {
    console.error('Get image by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching image.' });
  }
};

// Upload a new image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const {
      title,
      description,
      category_id,
      year,
      location,
      department,
      source,
      keywords
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Image title is required.' });
    }

    const memoryData = {
      title,
      description,
      image_path: req.file.imagePath,
      thumbnail_path: req.file.thumbnailPath,
      category_id: category_id || null,
      year: year || null,
      location: location || null,
      department: department || null,
      source: source || null,
      keywords: keywords || null,
      uploaded_by: req.user.id,
      file_size: req.file.optimizedSize
    };

    const imageId = await Memory.create(memoryData);

    res.status(201).json({
      message: 'Image uploaded successfully.',
      imageId,
      image: {
        ...memoryData,
        id: imageId
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ message: 'Server error while uploading image.' });
  }
};

// Update image metadata
exports.updateImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    
    // Check if image exists
    const image = await Memory.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // Only admin or the original uploader can update the image
    if (req.user.role !== 'admin' && image.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to update this image.' });
    }

    const {
      title,
      description,
      category_id,
      year,
      location,
      department,
      source,
      keywords
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Image title is required.' });
    }

    const updated = await Memory.update(imageId, {
      title,
      description,
      category_id: category_id || null,
      year: year || null,
      location: location || null,
      department: department || null,
      source: source || null,
      keywords: keywords || null
    });

    if (!updated) {
      return res.status(500).json({ message: 'Failed to update image.' });
    }

    res.status(200).json({ message: 'Image updated successfully.' });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ message: 'Server error while updating image.' });
  }
};

// Delete an image
exports.deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    
    // Check if image exists
    const image = await Memory.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found.' });
    }

    // Only admin or the original uploader can delete the image
    if (req.user.role !== 'admin' && image.uploaded_by !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this image.' });
    }

    // Delete the image files
    const imagePath = path.join(__dirname, '..', image.image_path);
    const thumbnailPath = path.join(__dirname, '..', image.thumbnail_path);
    
    // Delete from database first
    const deleted = await Memory.delete(imageId);
    
    if (!deleted) {
      return res.status(500).json({ message: 'Failed to delete image from database.' });
    }
    
    // Try to delete physical files
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    } catch (fileErr) {
      console.error('File deletion error:', fileErr);
      // Continue even if file deletion fails
    }

    res.status(200).json({ message: 'Image deleted successfully.' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error while deleting image.' });
  }
};

// Search and filter images
exports.searchImages = async (req, res) => {
  try {
    const { q, category_id, year, department, location } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Build filters object
    const filters = {};
    if (category_id) filters.category_id = category_id;
    if (year) filters.year = year;
    if (department) filters.department = department;
    if (location) filters.location = location;

    const images = await Memory.search(q, filters, limit, offset);
    const total = await Memory.getTotal(filters, q);

    res.status(200).json({
      images,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search images error:', error);
    res.status(500).json({ message: 'Server error while searching images.' });
  }
};

// Get related images
exports.getRelatedImages = async (req, res) => {
  try {
    const imageId = req.params.id;
    const limit = parseInt(req.query.limit) || 8;
    
    // Get the current image to find its category
    const image = await Memory.findById(imageId);
    
    if (!image || !image.category_id) {
      return res.status(404).json({ message: 'Image not found or has no category.' });
    }
    
    const relatedImages = await Memory.getRelated(imageId, image.category_id, limit);
    
    res.status(200).json({ relatedImages });
  } catch (error) {
    console.error('Get related images error:', error);
    res.status(500).json({ message: 'Server error while fetching related images.' });
  }
};

// Get filter options (years, departments, locations)
exports.getFilterOptions = async (req, res) => {
  try {
    const years = await Memory.getYears();
    const departments = await Memory.getDepartments();
    const locations = await Memory.getLocations();
    
    res.status(200).json({
      filterOptions: {
        years,
        departments,
        locations
      }
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ message: 'Server error while fetching filter options.' });
  }
};