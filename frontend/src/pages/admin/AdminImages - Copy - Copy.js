import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Spinner, Alert, Image } from 'react-bootstrap';
import { FaEye, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../utils/api';
import Pagination from '../../components/Pagination';

const AdminImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  
  const [filters, setFilters] = useState({
    q: '',
    category_id: '',
    year: ''
  });
  
  // Fetch data when component mounts
  useEffect(() => {
    fetchCategories();
    fetchImages(1);
  }, []);
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error("Failed to load categories.");
    }
  };
  
  // Fetch images with pagination and filters
  const fetchImages = async (page = 1) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      
      if (filters.q) params.append('q', filters.q);
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.year) params.append('year', filters.year);
      
      const endpoint = filters.q ? '/api/images/search' : '/api/images';
      const res = await api.get(`${endpoint}?${params.toString()}`);
      
      setImages(res.data.images);
      setPagination(res.data.pagination);
      setError(null);

      if (res.data.images.length === 0) {
        toast.warning("No images found with current filters.");
      } else {
        toast.success("Images loaded successfully!");
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please try again.');
      toast.error("Failed to fetch images!");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input change in filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle filter form submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    toast.info("Applying filters...");
    fetchImages(1); // Reset to first page when filters change
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    fetchImages(page);
  };
  
  // Handle delete image
  const handleDeleteClick = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/api/images/${imageId}`);
      
      // Refresh images list
      await fetchImages(pagination.page);
      setError(null);
      toast.success("Image deleted successfully!");
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(
        err.response?.data?.message || 
        'Failed to delete image. Please try again.'
      );
      toast.error("Failed to delete image!");
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-images">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Images</h2>
      </div>
      
      {/* Filter Section */}
      <div className="filter-section mb-4">
        <Form onSubmit={handleFilterSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="searchQuery">
                <Form.Control
                  type="text"
                  placeholder="Search images..."
                  name="q"
                  value={filters.q}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="categoryFilter">
                <Form.Select
                  name="category_id"
                  value={filters.category_id}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="yearFilter">
                <Form.Control
                  type="number"
                  placeholder="Year"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100"
                disabled={loading}
              >
                <FaSearch className="me-1" /> Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      {loading && images.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table responsive hover className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Uploader</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map(image => (
                <tr key={image.id}>
                  <td style={{ width: '100px' }}>
                    <Image 
                      src={process.env.REACT_APP_API_URL + image.thumbnail_path} 
                      alt={image.title}
                      thumbnail
                      style={{ maxWidth: '80px', maxHeight: '60px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/photo1754204660.jpg';
                      }}
                    />
                  </td>
                  <td>{image.title}</td>
                  <td>{image.category_name || '-'}</td>
                  <td>{image.uploader_name || 'Anonymous'}</td>
                  <td>{formatDate(image.created_at)}</td>
                  <td>
                    <Link 
                      to={`/images/${image.id}`} 
                      className="btn btn-outline-secondary btn-sm me-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaEye />
                    </Link>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(image.id)}
                      disabled={loading}
                    >
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
              {images.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No images found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          
          <Pagination 
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminImages;
