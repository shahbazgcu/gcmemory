import React, { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import Masonry from 'react-masonry-css';
import ImageCard from './ImageCard';
import './ImageGallery.css';

const ImageGallery = ({ images, selectedCategoryId }) => {
  const breakpointColumns = {
    default: 4,
    1200: 3,
    992: 2,
    576: 1
  };

  // Filter images based on selected category ID
  const filteredImages = useMemo(() => {
    if (!images || images.length === 0) {
      return [];
    }

    // If no category is selected, show all images
    if (!selectedCategoryId || selectedCategoryId === '') {
      return images;
    }

    // Filter images by category_id
    return images.filter(image => {
      return image.category_id && image.category_id.toString() === selectedCategoryId.toString();
    });
  }, [images, selectedCategoryId]);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-5">
        <h3 className="text-muted">No images found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (filteredImages.length === 0 && selectedCategoryId) {
    return (
      <div className="text-center py-5">
        <h3 className="text-muted">No images found in this category</h3>
        <p>Try selecting a different category or clear the filter</p>
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
        {filteredImages.map(image => (
          <div key={image.id} className="masonry-item mb-4">
            <ImageCard image={image} />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default ImageGallery;