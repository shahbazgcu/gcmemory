import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaImages, FaFolderOpen, FaCalendarAlt } from 'react-icons/fa';
import api from '../../utils/api';
import './AdminOverview.css';

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
        // Get all images (or a large enough number to cover recent uploads)
        const imagesRes = await api.get('/api/images?limit=1000');
        const images = imagesRes.data.images || [];

        // Get total users
        const usersRes = await api.get('/api/auth/users');

        // Get categories
        const categoriesRes = await api.get('/api/categories');

        // Get recent uploads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentUploads = images.filter(img => {
          const uploadedAt = new Date(img.created_at);
          return uploadedAt >= sevenDaysAgo;
        }).length;

        setStats({
          totalImages: imagesRes.data.pagination?.total || images.length,
          totalUsers: usersRes.data.users?.length || 0,
          totalCategories: categoriesRes.data.categories?.length || 0,
          recentUploads
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
      
      <Row className="overview-row">
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
      
    </div>
  );
};

export default AdminOverview;