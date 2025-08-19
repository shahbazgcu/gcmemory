import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#f9f9f9', // very light background
        color: '#922121', // deep red text for readability and brand
        paddingTop: '2rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
        borderTop: '2px solid #f9c97b', // peach border top for accent
      }}
    >
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 style={{ color: '#06014c', marginBottom: '1rem' }}>
              GCU Memories Archive Portal
            </h5>
            <p style={{ color: '#922121', fontSize: '0.9rem' }}>
              Preserving and sharing the rich history and memories of our university community.
            </p>
            <div className="social-icons">
              <a href="#" style={{ color: '#922121', marginRight: '1rem' }}>
                <FaFacebook size={20} />
              </a>
              <a href="#" style={{ color: '#922121', marginRight: '1rem' }}>
                <FaTwitter size={20} />
              </a>
              <a href="#" style={{ color: '#922121', marginRight: '1rem' }}>
                <FaInstagram size={20} />
              </a>
              <a href="#" style={{ color: '#922121' }}>
                <FaYoutube size={20} />
              </a>
            </div>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <h6 style={{ color: '#06014c', marginBottom: '1rem' }}>Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/gallery" style={{ color: '#922121', textDecoration: 'none' }}>
                  Browse Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/upload" style={{ color: '#922121', textDecoration: 'none' }}>
                  Upload Memories
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" style={{ color: '#922121', textDecoration: 'none' }}>
                  About the Archive
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#922121', textDecoration: 'none' }}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 style={{ color: '#06014c', marginBottom: '1rem' }}>Contact Info</h6>
            <p style={{ color: '#922121', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              Government College University
            </p>
            <p style={{ color: '#922121', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              Lahore, Pakistan
            </p>
            <p style={{ color: '#922121', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              Email: archives@gcu.edu.pk
            </p>
            <p style={{ color: '#922121', fontSize: '0.9rem' }}>
              Phone: +92-42-99213340
            </p>
          </Col>
        </Row>

        <hr style={{ borderColor: '#f9c97b', margin: '1.5rem 0' }} />

        <Row>
          <Col className="text-center">
            <p style={{ color: '#922121', fontSize: '0.85rem', marginBottom: 0 }}>
              &copy; {currentYear} Government College University. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
