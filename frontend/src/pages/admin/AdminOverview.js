import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaUsers, FaImages, FaFolderOpen, FaCalendarAlt } from 'react-icons/fa';
import api from '../../utils/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalImages: 0,
    totalUsers: 0,
    totalCategories: 0,
    recentUploads: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For demonstration purposes, we're using actual API calls
        // In a real app, you might have a dedicated endpoint for admin stats
        
        // Get total images
        const imagesRes = await api.get('/api/images?limit=1');
        
        // Get total users
        const usersRes = await api.get('/api/auth/users');
        
        // Get categories
        const categoriesRes = await api.get('/api/categories');
        
        // Get recent uploads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        // Calculate stats
        setStats({
          totalImages: imagesRes.data.pagination?.total || 0,
          totalUsers: usersRes.data.users?.length || 0,
          totalCategories: categoriesRes.data.categories?.length || 0,
          recentUploads: 0  // In a real app, this would come from a dedicated endpoint
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load dashboard stats. Please try again.');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">{error}</Alert>
    );
  }
  
  return (
    <div className="admin-overview">
      <h2 className="mb-4">Dashboard Overview</h2>
      
      <Row>
        <Col lg={3} md={6} className="mb-4">
          <Card className="admin-card admin-images-card">
            <Card.Body>
              <FaImages className="admin-card-icon" />
              <div className="admin-card-count">{stats.totalImages}</div>
              <div className="admin-card-title">Total Images</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-4">
          <Card className="admin-card admin-users-card">
            <Card.Body>
              <FaUsers className="admin-card-icon" />
              <div className="admin-card-count">{stats.totalUsers}</div>
              <div className="admin-card-title">Registered Users</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-4">
          <Card className="admin-card admin-categories-card">
            <Card.Body>
              <FaFolderOpen className="admin-card-icon" />
              <div className="admin-card-count">{stats.totalCategories}</div>
              <div className="admin-card-title">Categories</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-4">
          <Card className="admin-card">
            <Card.Body>
              <FaCalendarAlt className="admin-card-icon" />
              <div className="admin-card-count">{stats.recentUploads}</div>
              <div className="admin-card-title">Uploads This Week</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>Recent Activities</Card.Header>
            <Card.Body>
              <p className="text-muted text-center py-4">
                Activity tracking will be implemented in future updates.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;