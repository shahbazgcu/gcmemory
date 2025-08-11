import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, Badge, Card } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaDownload, FaEdit, FaTrashAlt, FaExpandAlt, FaCalendarAlt, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import RelatedImages from '../components/RelatedImages';
import ImageLightbox from '../components/ImageLightbox';
import './ImageDetailsPage.css';

const ImageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [image, setImage] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Check if user can edit/delete the image
  const canModifyImage = () => {
    if (!isAuthenticated || !image) return false;
    return user.role === 'admin' || (image.uploaded_by === user.id);
  };

  // Fetch image details and related images
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch image details
        const imageRes = await api.get(`/api/images/${id}`);
        setImage(imageRes.data.image);
        
        // Fetch related images
        const relatedRes = await api.get(`/api/images/${id}/related`);
        setRelatedImages(relatedRes.data.relatedImages);
      } catch (err) {
        console.error('Error fetching image details:', err);
        setError('Failed to load image details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Handle image download
const handleDownload = () => {
  if (!image) return;

  const link = document.createElement('a');
  link.href = process.env.REACT_APP_API_URL + image.image_path;
  link.download = `gcu-memory-${image.id}-${image.title.replace(/\s+/g, '-')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  // Handle image deletion
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      await api.delete(`/api/images/${id}`);
      navigate('/gallery', { state: { message: 'Image deleted successfully.' } });
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image. Please try again.');
      setDeleteLoading(false);
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  // Show error message
  if (error || !image) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Image not found.'}
        </Alert>
        <Button as={Link} to="/gallery" variant="primary">
          Return to Gallery
        </Button>
      </Container>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="image-details-page">
      <Container>
        <div className="image-details-container">
          <Row>
            <Col lg={8}>
              <div className="image-main-container">
                <div className="image-actions">
                  <Button 
                    variant="light" 
                    className="zoom-btn"
                    onClick={() => setShowLightbox(true)}
                  >
                    <FaExpandAlt />
                  </Button>
                </div>
                <img 
                  src={process.env.REACT_APP_API_URL + image.image_path} 
                  alt={image.title}
                  className="image-main"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/photo1754121287.jpg';
                  }}
                />
              </div>
            </Col>
            
            <Col lg={4}>
              <Card className="image-details-card">
                <Card.Body>
                  <h1 className="image-title">{image.title}</h1>
                  
                  {image.category_name && (
                    <Badge bg="secondary" className="category-badge">
                      {image.category_name}
                    </Badge>
                  )}
                  
                  {image.description && (
                    <div className="image-description mt-3">
                      <p>{image.description}</p>
                    </div>
                  )}
                  
                  <hr />
                  
                  <div className="image-metadata">
                    {image.year && (
                      <div className="metadata-item">
                        <FaCalendarAlt className="metadata-icon" />
                        <span className="metadata-label">Year:</span>
                        <span className="metadata-value">{image.year}</span>
                      </div>
                    )}
                    
                    {image.location && (
                      <div className="metadata-item">
                        <FaMapMarkerAlt className="metadata-icon" />
                        <span className="metadata-label">Location:</span>
                        <span className="metadata-value">{image.location}</span>
                      </div>
                    )}
                    
                    {image.department && (
                      <div className="metadata-item">
                        <FaBuilding className="metadata-icon" />
                        <span className="metadata-label">Department:</span>
                        <span className="metadata-value">{image.department}</span>
                      </div>
                    )}
                    
                    {image.source && (
                      <div className="metadata-item">
                        <span className="metadata-label">Source:</span>
                        <span className="metadata-value">{image.source}</span>
                      </div>
                    )}
                    
                    {image.keywords && (
                      <div className="keywords-container">
                        <span className="metadata-label">Keywords:</span>
                        <div className="keywords-list">
                          {image.keywords.split(',').map((keyword, index) => (
                            <Badge 
                              key={index} 
                              bg="light" 
                              text="dark" 
                              className="keyword-badge"
                            >
                              {keyword.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <hr />
                  
                  <div className="image-footer">
                    <div className="upload-info">
                      {image.uploader_name && (
                        <span>Uploaded by {image.uploader_name}</span>
                      )}
                      <span>on {formatDate(image.created_at)}</span>
                    </div>
                    
                    <div className="image-actions-footer mt-3">
                      <Button 
                        variant="primary" 
                        onClick={handleDownload}
                        className="me-2"
                      >
                        <FaDownload className="me-1" /> Download
                      </Button>
                      
                      {canModifyImage() && (
                        <>
                          <Link 
                            to={`/images/${image.id}/edit`} 
                            className="btn btn-outline-secondary me-2"
                          >
                            <FaEdit className="me-1" /> Edit
                          </Link>
                          
                          <Button 
                            variant="outline-danger" 
                            onClick={handleDelete}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <Spinner 
                                as="span" 
                                animation="border" 
                                size="sm" 
                                role="status" 
                                aria-hidden="true" 
                              />
                            ) : (
                              <>
                                <FaTrashAlt className="me-1" /> Delete
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
        
        {/* Related Images Section */}
        <RelatedImages 
          images={relatedImages} 
          currentImageId={image.id} 
        />
      </Container>
      
      {/* Lightbox Modal */}
      <ImageLightbox 
        show={showLightbox}
        onHide={() => setShowLightbox(false)}
        image={image}
        relatedImages={relatedImages}
      />
    </div>
  );
};

export default ImageDetailsPage;