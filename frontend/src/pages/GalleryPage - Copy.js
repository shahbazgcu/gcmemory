import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ImageGallery from '../components/ImageGallery';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import './GalleryPage.css';

const GalleryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  });

  // Extract search query and filters from URL params
  const query = searchParams.get('q') || '';
  const category_id = searchParams.get('category_id') || '';
  const year = searchParams.get('year') || '';
  const department = searchParams.get('department') || '';
  const location = searchParams.get('location') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch images based on search parameters
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let endpoint = '/api/images';
        const params = new URLSearchParams();
        
        // Add search and filter params
        if (query) {
          endpoint = '/api/images/search';
          params.append('q', query);
        }
        
        if (category_id) params.append('category_id', category_id);
        if (year) params.append('year', year);
        if (department) params.append('department', department);
        if (location) params.append('location', location);
        
        // Add pagination
        params.append('page', page.toString());
        params.append('limit', '20'); // Fixed limit
        
        const res = await api.get(`${endpoint}?${params.toString()}`);
        
        setImages(res.data.images);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [query, category_id, year, department, location, page]);

  // Update search params when filters change
  const handleFilterChange = (filters) => {
    const newParams = new URLSearchParams();
    
    if (query) newParams.append('q', query);
    if (filters.category_id) newParams.append('category_id', filters.category_id);
    if (filters.year) newParams.append('year', filters.year);
    if (filters.department) newParams.append('department', filters.department);
    if (filters.location) newParams.append('location', filters.location);
    
    // Reset to page 1 when filters change
    newParams.append('page', '1');
    
    setSearchParams(newParams);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Build page title based on search/filters
  const buildPageTitle = () => {
    if (query) {
      return `Search Results for "${query}"`;
    }
    
    let title = 'Image Gallery';
    
    if (category_id || year || department || location) {
      title = 'Filtered Results';
    }
    
    return title;
  };

  return (
    <div className="gallery-page">
      <Container>
        <div className="gallery-header">
          <h1>{buildPageTitle()}</h1>
          {pagination.total > 0 && (
            <p className="text-muted">
              Showing {Math.min((page - 1) * pagination.limit + 1, pagination.total)} - {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} images
            </p>
          )}
        </div>
        
        <SearchFilters 
          onFilterChange={handleFilterChange} 
          initialFilters={{ category_id, year, department, location }}
        />
        
        {error && (
          <Alert variant="danger" className="my-3">
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <ImageGallery images={images} />
            
            {pagination.total > 0 && (
              <Pagination 
                currentPage={page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default GalleryPage;