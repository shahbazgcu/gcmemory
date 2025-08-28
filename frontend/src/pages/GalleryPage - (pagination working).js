import React, { useState, useEffect, useCallback } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ImageGallery from '../components/ImageGallery';
import Pagination from '../components/Pagination';
import './GalleryPage.css';

const SearchFilters = ({ initialFilters, onFilterChange, categories }) => {
  const [searchText, setSearchText] = useState(initialFilters.q || '');
  const [category_id, setCategoryId] = useState(initialFilters.category_id || '');

  // Sync internal state with initialFilters whenever they change
  useEffect(() => {
    setSearchText(initialFilters.q || '');
    setCategoryId(initialFilters.category_id || '');
  }, [initialFilters.q, initialFilters.category_id]);

  // Debounce filter changes and apply min length logic
  useEffect(() => {
    const debounce = setTimeout(() => {
      const trimmed = searchText.trim();
      // Only call onFilterChange if filters actually changed
      if (
        trimmed !== initialFilters.q ||
        category_id !== initialFilters.category_id
      ) {
        if (trimmed === '' || trimmed.length >= 3) {
          onFilterChange({
            q: trimmed,
            category_id,
          });
        }
      }
    }, 400);

    return () => clearTimeout(debounce);
  }, [searchText, category_id, initialFilters.q, initialFilters.category_id, onFilterChange]);

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
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState(null);

  const query = searchParams.get('q') || '';
  const category_id = searchParams.get('category_id') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

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

  // Fetch category details on category_id change
  useEffect(() => {
    if (!category_id) {
      setCategoryDetails(null);
      return;
    }
    const fetchCategoryDetails = async () => {
      try {
        console.log('Fetching category details for category_id:', category_id);
        const res = await api.get(`/api/categories/${category_id}`);
        setCategoryDetails(res.data.category);
        console.log(res.data)
        console.log(res.data.category)
      } catch (error) {
        console.error('Failed to fetch category details:', error);
        setCategoryDetails(null);
      }
    };
    fetchCategoryDetails();
  }, [category_id]);

  // Memoize handleFilterChange
  const handleFilterChange = useCallback((filters) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);

      let filtersChanged = false;

      if (filters.q !== prevParams.get('q')) {
        filtersChanged = true;
        if (filters.q) {
          newParams.set('q', filters.q);
        } else {
          newParams.delete('q');
        }
      }

      if (filters.category_id !== prevParams.get('category_id')) {
        filtersChanged = true;
        if (filters.category_id) {
          newParams.set('category_id', filters.category_id);
        } else {
          newParams.delete('category_id');
        }
      }

      if (filtersChanged) {
        newParams.set('page', '1');
      }

      return newParams;
    });
  }, [setSearchParams]);

  // Fetch images on filters or page change
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        // Always use the same endpoint but determine the logic based on parameters
        let endpoint = '/api/images';
        const params = new URLSearchParams();

        // If we have a search query with minimum length, use search endpoint
        if (query && query.length >= 3) {
          endpoint = '/api/images/search';
          params.append('q', query);
        }

        // Always add category_id if it exists (works for both search and regular endpoints)
        if (category_id) {
          params.append('category_id', category_id);
        }

        params.append('page', page.toString());
        params.append('limit', '20');

        console.log('Fetching images with:', endpoint, params.toString());

        const res = await api.get(`${endpoint}?${params.toString()}`);

        console.log('API Response:', res.data); // Debug log to see what backend returns

        setImages(res.data.images || []);
        setPagination(res.data.pagination || { total: 0, page: 1, limit: 20, pages: 1 });
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
    if (category_id && categoryDetails) {
      return `Images in "${categoryDetails.name}"`;
    }
    return 'Image Gallery';
  };

  return (
    <div className="gallery-page">
      <Container>
        <div className="gallery-header">
          <h3>{buildPageTitle()}</h3>
          {/* {pagination.total > 0 && (
            <p className="text-muted">
              Showing{' '}
              {Math.min((page - 1) * pagination.limit + 1, pagination.total)} -{' '}
              {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} images
            </p>
          )} */}
        </div>

        {/* {categoryDetails && (
          <div className="category-details my-3 p-3 border rounded bg-light">
            <h2>{categoryDetails.name}</h2>
            <p>{categoryDetails.description}</p>
            <small>Created at: {new Date(categoryDetails.created_at).toLocaleDateString()}</small>
          </div>
        )} */}

        <SearchFilters
          onFilterChange={handleFilterChange}
          initialFilters={{ q: query, category_id }}
          categories={categories}
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
            <ImageGallery images={images} selectedCategoryId={category_id} />

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