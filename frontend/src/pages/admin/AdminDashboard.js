// AdminDashboard.js

import React, { useState } from 'react';
import { Container, Row, Col, Nav, Alert } from 'react-bootstrap';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  FaUsers,
  FaFolderOpen,
  FaImages,
  FaTachometerAlt,
  FaUpload
} from 'react-icons/fa';

import AdminOverview from './AdminOverview';
import AdminImages from './AdminImages';
import AdminCategories from './AdminCategories';
import AdminUsers from './AdminUsers';
import UploadImage from '../UploadPage';
import AdminImageView from './AdminImageView';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || '');

  const getActiveKey = () => {
    const path = location.pathname;

    if (path.startsWith('/admin/images')) return 'images';
    if (path.startsWith('/admin/categories')) return 'categories';
    if (path.startsWith('/admin/users')) return 'users';
    if (path.startsWith('/admin/upload')) return 'upload';
    return 'overview';
  };

  const clearMessage = () => setMessage('');

  return (
    <div className="admin-dashboard">
      <Container fluid>
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Manage GCU Memories Archive Portal</p>
        </div>

        {message && (
          <Alert
            variant="success"
            dismissible
            onClose={clearMessage}
            className="mb-4"
          >
            {message}
          </Alert>
        )}

        <Row>
          <Col lg={2} md={3} className="mb-4 mb-md-0">
            <Nav variant="pills" className="flex-column admin-nav">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/admin"
                  className={getActiveKey() === 'overview' ? 'active' : ''}
                >
                  <FaTachometerAlt className="me-2" /> Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/admin/images"
                  className={getActiveKey() === 'images' ? 'active' : ''}
                >
                  <FaImages className="me-2" /> Images
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/admin/upload"
                  className={getActiveKey() === 'upload' ? 'active' : ''}
                >
                  <FaUpload className="me-2" /> Upload Image
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/admin/categories"
                  className={getActiveKey() === 'categories' ? 'active' : ''}
                >
                  <FaFolderOpen className="me-2" /> Categories
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col lg={10} md={9}>
            <div className="admin-content">
              <Routes>
                <Route index element={<AdminOverview />} />
                <Route path="images" element={<AdminImages />} />
                <Route path="images/:id" element={<AdminImageView />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="upload" element={<UploadImage />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
