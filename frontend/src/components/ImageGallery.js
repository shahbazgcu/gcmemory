import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
  const breakpointColumns = {
    default: 4,
    1200: 3,
    992: 2,
    576: 1
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-5">
        <h3 className="text-muted">No images found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {images.map(image => (
          <div key={image.id} className="masonry-item mb-4">
            <ImageCard image={image} />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGallery;