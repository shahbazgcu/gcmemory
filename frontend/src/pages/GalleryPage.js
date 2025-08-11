import React, { useState, useEffect, useCallback } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ImageGallery from '../components/ImageGallery';
import Pagination from '../components/Pagination';
import './GalleryPage.css';

const SearchFilters = ({ initialFilters, onFilterChange }) => {
  const [searchText, setSearchText] = useState(initialFilters.q || '');
  const [category_id, setCategoryId] = useState(initialFilters.category_id || '');
  const [categories, setCategories] = useState([]);

  // Sync internal state with initialFilters whenever they change
  useEffect(() => {
    setSearchText(initialFilters.q || '');
    setCategoryId(initialFilters.category_id || '');
  }, [initialFilters.q, initialFilters.category_id]);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data.categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Debounce filter changes and apply min length logic
  useEffect(() => {
    const debounce = setTimeout(() => {
      const trimmed = searchText.trim();
      if (trimmed === '' || trimmed.length >= 3) {
        // DEBUG LOG
        console.log('Filters changed:', { q: trimmed, category_id });
        onFilterChange({
          q: trimmed,
          category_id,
        });
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchText, category_id, onFilterChange]);

  return (
    <form className="mb-4" onSubmit={e => e.preventDefault()}>
      <div className="row g-3">
        <div className="col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Search by title or keyword..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
};

const GalleryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });

  const query = searchParams.get('q') || '';
  const category_id = searchParams.get('category_id') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Memoize handleFilterChange so it doesn't trigger unnecessary effects
  const handleFilterChange = useCallback((filters) => {
    const newParams = new URLSearchParams();

    if (filters.q) newParams.append('q', filters.q);
    if (filters.category_id) {
      newParams.append('category_id', filters.category_id);
    }

    newParams.append('page', '1'); // Reset page on filter change

    console.log('Setting search params:', newParams.toString()); // DEBUG LOG
    setSearchParams(newParams);
  }, [setSearchParams]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = '/api/images';
        const params = new URLSearchParams();

        if (query && query.length >= 3) {
          endpoint = '/api/images/search';
          params.append('q', query);
        }

        if (category_id) params.append('category_id', category_id);

        params.append('page', page.toString());
        params.append('limit', '20');

        // DEBUG LOG
        console.log('Fetching images with:', endpoint, params.toString());

        const res = await api.get(`${endpoint}?${params.toString()}`);

        setImages(res.data.images);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error('Error fetching images:', err.response ? err.response.data : err.message);
        setError('Failed to load images. Please try again later.');
        setImages([]);
        setPagination({ total: 0, page: 1, limit: 20, pages: 1 });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query, category_id, page]);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPageTitle = () => {
    if (query && query.length >= 3) {
      return `Search Results for "${query}"`;
    }
    if (category_id) {
      return 'Filtered Results';
    }
    return 'Image Gallery';
  };

  return (
    <div className="gallery-page">
      <Container>
        <div className="gallery-header">
          <h1>{buildPageTitle()}</h1>
          {pagination.total > 0 && (
            <p className="text-muted">
              Showing{' '}
              {Math.min((page - 1) * pagination.limit + 1, pagination.total)} -{' '}
              {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} images
            </p>
          )}
        </div>

        <SearchFilters
          onFilterChange={handleFilterChange}
          initialFilters={{ q: query, category_id }}
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
