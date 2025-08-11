import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ImageCard.css';

const ImageCard = ({ image, className = '' }) => {
  // Use thumbnail path if available, otherwise use full image path
  const imageSrc = image.thumbnail_path || image.image_path;
  
  const fullImageUrl = process.env.REACT_APP_API_URL + imageSrc;

  // Debug output (this is where you log it)
  // console.log(fullImageUrl);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
     // Full image URL

  };

  return (
    <Card className={`image-card ${className}`}>
      <Link to={`/images/${image.id}`} className="image-card-link">
        <div className="image-card-img-container">
          <Card.Img 
            variant="top" 
            src={fullImageUrl} 
            // src={process.env.REACT_APP_API_URL + imageSrc} 
            alt={image.title}
            className="image-card-img" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
        
        

        <Card.Body className="image-card-body">
          <Card.Title className="image-card-title">{image.title}</Card.Title>
          
          <div className="image-card-meta">
            {image.year && (
              <span className="image-card-year">{image.year}</span>
            )}
            {image.category_name && (
              <span className="image-card-category">{image.category_name}</span>
            )}
          </div>
          
          {/* {image.description && (
            <Card.Text className="image-card-description">
              {image.description.length > 80 
                ? `${image.description.substring(0, 80)}...` 
                : image.description}
            </Card.Text>
          )} */}
          
          <div className="image-card-footer">
            <small className="text-muted">
              uploaded on: {formatDate(image.created_at)}
            </small>
          </div>
          
        </Card.Body>
      </Link>
    </Card>
  );
};

export default ImageCard;