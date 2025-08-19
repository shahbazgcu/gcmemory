import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Alert, Image, Button } from 'react-bootstrap';
import api from '../../utils/api';
import './AdminImageView.css';

const AdminImageView = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`/api/images/${id}`);
        setImage(res.data.image);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Image not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="admin-image-view">
      <div className="image-view-header">
        <h2>{image.title}</h2>
        <Link to="/admin/images" className="image-view-back-button">
          ← Back to Images
        </Link>
      </div>

      <div className="image-preview-container">
        <Image
          src={process.env.REACT_APP_API_URL + image.image_path}
          alt={image.title}
          fluid
        />
      </div>

      <dl className="image-details">
        <dt>Title</dt>
        <dd>{image.title}</dd>

        <dt>Category</dt>
        <dd>{image.category_name || '-'}</dd>

        <dt>Description</dt>
        <dd>{image.description || 'No description provided.'}</dd>

        <dt>Uploaded</dt>
        <dd>{new Date(image.created_at).toLocaleString()}</dd>
      </dl>

      <div className="image-actions">
        <Button variant="primary" disabled>
          Edit
        </Button>
        <Button variant="danger" disabled>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminImageView;
