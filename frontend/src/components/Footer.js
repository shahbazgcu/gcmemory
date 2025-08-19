import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#f9f9f9', // very light background
        color: '#922121', // deep red text for readability and brand
        paddingTop: '2rem',
        paddingBottom: '2rem',
        // marginTop: 'auto',
        borderTop: '2px solid #000080', // peach border top for accent
      }}
    >
      <Container>
        
        <Row>
          <Col className="text-center">
            <p style={{ color: '#922121', fontSize: '0.85rem', marginBottom: 0 }}>
              &copy; {currentYear} Directorate IT, GC University. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
