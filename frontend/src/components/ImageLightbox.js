import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Carousel } from 'react-bootstrap';
import { FaDownload, FaArrowLeft, FaArrowRight, FaTimesCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ImageLightbox.css';

const ImageLightbox = ({ show, onHide, image, relatedImages = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    // If current image is provided, add it as the first image
    if (image) {
      const allImages = [image, ...relatedImages.filter(img => img.id !== image.id)];
      setImages(allImages);
      setCurrentIndex(0);
    } else {
      setImages(relatedImages);
    }
  }, [image, relatedImages]);
  
  // Handle image navigation
  const handleSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  // Navigate to previous image
  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Navigate to next image
  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Handle download
  const handleDownload = () => {
    if (!images[currentIndex]) return;
    
    const link = document.createElement('a');
    link.href = process.env.REACT_APP_API_URL + currentImage.image_path;
    link.download = `gcu-memory-${currentImage.id}-${currentImage.title.replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  };
  
  if (!show || !images.length) {
    return null;
  }
  
  const currentImage = images[currentIndex];

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="lightbox-modal"
    >
      <Modal.Header closeButton className="border-0 bg-dark text-white">
        {/* <Modal.Title>{currentImage?.title}</Modal.Title> */}
      </Modal.Header>
      
      <Modal.Body className="p-0 bg-dark text-white position-relative">
        {/* Custom Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              className="custom-carousel-arrow custom-carousel-prev"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            
            <button 
              className="custom-carousel-arrow custom-carousel-next"
              onClick={handleNext}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        <Carousel 
          activeIndex={currentIndex}
          onSelect={handleSelect}
          interval={null}
          indicators={false}
          controls={false} // Disable default controls since we're using custom ones
          className="lightbox-carousel"
        >
          {images.map((img) => (
            <Carousel.Item key={img.id}>
              <div className="lightbox-img-container">
                <img
                  className="lightbox-img"
                  src={process.env.REACT_APP_API_URL + img.image_path}
                  alt={img.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/photo1754121168.jpg';
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-0 bg-dark text-white">
        <div className="lightbox-info">
          {/* <h5>{currentImage?.title}</h5> */}
          
          {/* {currentImage?.description && (
            <p className="mb-2">{currentImage.description}</p>
          )} */}
          
          <Row className="metadata-row">
            {/* {currentImage?.category_name && (
              <Col xs={6} md={4} className="metadata-item">
                <strong>Category:</strong> {currentImage.category_name}
              </Col>
            )} */}
            
            {/* {currentImage?.year && (
              <Col xs={6} md={4} className="metadata-item">
                <strong>Year:</strong> {currentImage.year}
              </Col>
            )} */}
            
            {/* {currentImage?.location && (
              <Col xs={6} md={4} className="metadata-item">
                <strong>Location:</strong> {currentImage.location}
              </Col>
            )} */}
            
            {/* {currentImage?.department && (
              <Col xs={6} md={4} className="metadata-item">
                <strong>Department:</strong> {currentImage.department}
              </Col>
            )} */}
          </Row>
        </div>
        
        {/* <Button 
          variant="primary" 
          onClick={handleDownload}
          className="download-btn"
        >
          <FaDownload /> Download
        </Button> */}
        
        {/* <Button 
          variant="outline-light" 
          onClick={onHide}
          className="close-btn"
        >
          <FaTimesCircle /> Close
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default ImageLightbox;