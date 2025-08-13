const Category = require('../models/categoryModel');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories.' });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log('Category ID:', categoryId);
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    
    res.status(200).json({ category });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching category.' });
  }
};

// Create a new category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }
    
    const categoryId = await Category.create({ name, description });
    
    res.status(201).json({ 
      message: 'Category created successfully.',
      categoryId
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error while creating category.' });
  }
};

// Update a category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }
    
    const updated = await Category.update(categoryId, { name, description });
    
    if (!updated) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    
    res.status(200).json({ message: 'Category updated successfully.' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error while updating category.' });
  }
};

// Delete a category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const deleted = await Category.delete(categoryId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error while deleting category.' });
  }
};