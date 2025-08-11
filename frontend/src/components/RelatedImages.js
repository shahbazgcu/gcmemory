import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './RelatedImages.css';

const RelatedImages = ({ images, currentImageId }) => {
  if (!images || images.length === 0) {
    return null;
  }

  // Filter out the current image if it's in the related images list
  const filteredImages = images.filter(img => img.id !== currentImageId);

  if (filteredImages.length === 0) {
    return null;
  }

  return (
    <div className="related-images">
      <h5 className="related-title">Related Images</h5>
      
      <Row className="related-row">
        {filteredImages.map(image => (
          <Col xs={6} md={4} lg={3} key={image.id} className="related-col">
            <Link to={`/images/${image.id}`} className="related-link">
              <Card className="related-card">
                <div className="related-img-container">
                  <Card.Img 
                    src={process.env.REACT_APP_API_URL + image.thumbnail_path} 
                    alt={image.title} 
                    className="related-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/Placeholder.jpg';
                    }}
                  />
                </div>
                <Card.Body className="related-body">
                  <Card.Title className="related-title">{image.title}</Card.Title>
                  {image.year && <div className="related-year">{image.year}</div>}
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RelatedImages;