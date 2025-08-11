import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import api from '../../utils/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: '',
    description: ''
  });
  const [formError, setFormError] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/categories');
      setCategories(res.data.categories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({
      ...currentCategory,
      [name]: value
    });
  };

  // Open modal in add mode
  const handleAddClick = () => {
    setCurrentCategory({ id: null, name: '', description: '' });
    setModalMode('add');
    setFormError('');
    setShowModal(true);
  };

  // Open modal in edit mode
  const handleEditClick = (category) => {
    setCurrentCategory({ ...category });
    setModalMode('edit');
    setFormError('');
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!currentCategory.name.trim()) {
      setFormError('Category name is required');
      return;
    }
    
    try {
      setLoading(true);
      
      if (modalMode === 'add') {
        // Create new category
        await api.post('/api/categories', currentCategory);
      } else {
        // Update existing category
        await api.put(`/api/categories/${currentCategory.id}`, currentCategory);
      }
      
      // Refresh categories list
      await fetchCategories();
      
      // Close modal
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error saving category:', err);
      setFormError(
        err.response?.data?.message || 
        'Failed to save category. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteClick = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This may affect images using this category.')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/api/categories/${categoryId}`);
      await fetchCategories();
      setError(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(
        err.response?.data?.message || 
        'Failed to delete category. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Categories</h2>
        <Button 
          variant="primary" 
          onClick={handleAddClick}
          disabled={loading}
        >
          <FaPlus className="me-1" /> Add Category
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Table responsive hover className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEditClick(category)}
                >
                  <FaEdit />
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDeleteClick(category.id)}
                  disabled={loading}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      
      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && (
            <Alert variant="danger">{formError}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="categoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentCategory.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="categoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentCategory.description || ''}
                onChange={handleInputChange}
                placeholder="Enter category description (optional)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminCategories;