import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

      if (res.data.categories.length > 0) {
        toast.success("Categories loaded successfully!");
      } else {
        toast.warning("No categories found!");
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      toast.error("Failed to fetch categories!");
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

    toast.info("Adding a new category");
  };

  // Open modal in edit mode
  const handleEditClick = (category) => {
    setCurrentCategory({ ...category });
    setModalMode('edit');
    setFormError('');
    setShowModal(true);

    toast.info(`Editing category: ${category.name}`);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentCategory.name.trim()) {
      setFormError('Category name is required');
      toast.warning("Category name is required!");
      return;
    }
    
    try {
      setLoading(true);
      
      if (modalMode === 'add') {
        await api.post('/api/categories', currentCategory);
        toast.success('Category added successfully ✅');
      } else {
        await api.put(`/api/categories/${currentCategory.id}`, currentCategory);
        toast.success('Category updated successfully ✅');
      }
      
      await fetchCategories();
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error("Failed to save category!");
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
      toast.success('Category deleted successfully ✅');
      setError(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error("Failed to delete category!");
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
    <>
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

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminCategories;
