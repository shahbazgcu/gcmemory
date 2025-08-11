import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="text-primary mb-3">GCU Memories Archive Portal</h5>
            <p className="small">
              Preserving and sharing the rich history and memories of our university community.
            </p>
            <div className="social-icons">
              <a href="#" className="text-light me-3">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-light me-3">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-light me-3">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-light">
                <FaYoutube size={20} />
              </a>
            </div>
          </Col>
          
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="text-primary mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/gallery" className="text-light text-decoration-none">Browse Gallery</Link>
              </li>
              <li className="mb-2">
                <Link to="/upload" className="text-light text-decoration-none">Upload Memories</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">About the Archive</Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none">Contact Us</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h6 className="text-primary mb-3">Contact Info</h6>
            <p className="small mb-1">Government College University</p>
            <p className="small mb-1">Lahore, Pakistan</p>
            <p className="small mb-1">Email: archives@gcu.edu.pk</p>
            <p className="small">Phone: +92-42-99213340</p>
          </Col>
        </Row>
        
        <hr className="bg-secondary my-3" />
        
        <Row>
          <Col className="text-center">
            <p className="small mb-0">
              &copy; {currentYear} Government College University. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;