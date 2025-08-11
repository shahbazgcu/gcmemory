import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Card, Collapse } from 'react-bootstrap';
import { FaFilter, FaTimes } from 'react-icons/fa';
import api from '../utils/api';
import './SearchFilters.css';

const SearchFilters = ({ onFilterChange, initialFilters }) => {
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    category_id: initialFilters?.category_id || '',
    year: initialFilters?.year || '',
    department: initialFilters?.department || '',
    location: initialFilters?.location || ''
  });

  // Fetch filter options when component mounts
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch categories
        const categoriesRes = await api.get('/api/categories');
        setCategories(categoriesRes.data.categories);
        
        // Fetch other filter options
        const optionsRes = await api.get('/api/images/filter-options');
        setYears(optionsRes.data.filterOptions.years);
        setDepartments(optionsRes.data.filterOptions.departments);
        setLocations(optionsRes.data.filterOptions.locations);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    onFilterChange(filters);
    
    // On mobile, collapse the filter panel after applying
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = {
      category_id: '',
      year: '',
      department: '',
      location: ''
    };
    
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  // Check if any filter is active
  const isFiltersActive = () => {
    return Object.values(filters).some(value => value !== '');
  };

  return (
    <div className="search-filters mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Filters</h5>
        <Button 
          variant="link" 
          className="d-md-none p-0 text-decoration-none" 
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <FaFilter /> {showFilters ? 'Hide' : 'Show'} Filters
        </Button>
        {isFiltersActive() && (
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={clearFilters}
            className="d-none d-md-block"
          >
            <FaTimes /> Clear Filters
          </Button>
        )}
      </div>

      <Collapse in={showFilters} className="d-md-block">
        <Card body>
          <Form onSubmit={applyFilters}>
            <Row>
              <Col md={6} lg={3} className="mb-3">
                <Form.Group controlId="categoryFilter">
                  <Form.Label>Category</Form.Label>
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

              <Col md={6} lg={3} className="mb-3">
                <Form.Group controlId="yearFilter">
                  <Form.Label>Year</Form.Label>
                  <Form.Select 
                    name="year" 
                    value={filters.year} 
                    onChange={handleFilterChange}
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <Form.Group controlId="departmentFilter">
                  <Form.Label>Department</Form.Label>
                  <Form.Select 
                    name="department" 
                    value={filters.department} 
                    onChange={handleFilterChange}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6} lg={3} className="mb-3">
                <Form.Group controlId="locationFilter">
                  <Form.Label>Location</Form.Label>
                  <Form.Select 
                    name="location" 
                    value={filters.location} 
                    onChange={handleFilterChange}
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-2">
              {isFiltersActive() && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={clearFilters}
                  className="d-md-none"
                >
                  Clear All
                </Button>
              )}
              <Button 
                type="submit" 
                variant="primary" 
                size="sm" 
                className="ms-auto"
              >
                Apply Filters
              </Button>
            </div>
          </Form>
        </Card>
      </Collapse>
    </div>
  );
};

export default SearchFilters;