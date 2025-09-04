import React from 'react';
import Slider from 'react-slick';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './RelatedImages.css';

//npm install react-slick slick-carousel

// Custom arrows with proper arrow shapes (no text content needed since CSS handles the arrows)
const NextArrow = ({ onClick }) => (
  <div className="slick-arrow slick-next" onClick={onClick}></div>
);

const PrevArrow = ({ onClick }) => (
  <div className="slick-arrow slick-prev" onClick={onClick}></div>
);

const RelatedImages = ({ images, currentImageId }) => {
  if (!images || images.length === 0) return null;

  // Filter out the current image
  const filteredImages = images.filter(img => img.id !== currentImageId);

  if (filteredImages.length === 0) return null;

  // Enhanced slider settings for consistent behavior
  const settings = {
    dots: false,
    infinite: filteredImages.length > 6, // Only infinite if more than 6 images
    speed: 500,
    slidesToShow: 6, // Always show 6 on desktop
    slidesToScroll: 2,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipeToSlide: true,
    touchMove: true,
    variableWidth: false, // Ensure equal widths
    centerMode: false,
    responsive: [
      {
        breakpoint: 1400, // Large screens
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          infinite: filteredImages.length > 5
        }
      },
      {
        breakpoint: 1200, // Medium large screens
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: filteredImages.length > 4
        }
      },
      {
        breakpoint: 992, // Medium screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: filteredImages.length > 3
        }
      },
      {
        breakpoint: 768, // Small screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: filteredImages.length > 2
        }
      },
      {
        breakpoint: 576, // Extra small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: filteredImages.length > 1,
          centerMode: true,
          centerPadding: '20px'
        }
      }
    ]
  };

  return (
    <div className="related-images">
      <h5 className="related-heading">Related Images</h5>
      
      <div className="slider-container">
        <Slider {...settings}>
          {filteredImages.map(image => (
            <div key={image.id} className="related-slide">
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
                  {/* Card body removed to eliminate white borders and use full image */}
                </Card>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default RelatedImages;