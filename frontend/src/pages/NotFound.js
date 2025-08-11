import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <div className="not-found-content">
              <h1 className="not-found-title">404</h1>
              <h2 className="not-found-subtitle">Page Not Found</h2>
              <p className="not-found-text">
                The page you're looking for doesn't exist or has been moved.
              </p>
              
              <div className="not-found-actions">
                <Link to="/">
                  <Button variant="primary" className="me-3">
                    <FaHome className="me-2" /> Go Home
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button variant="outline-secondary">
                    <FaSearch className="me-2" /> Browse Gallery
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;