import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert, ProgressBar, Row, Col, Image } from 'react-bootstrap';
import api from '../../utils/api';

const EditImage = ({ image, onClose, onEditSuccess }) => {
  const navigate = useNavigate();
  const id = image?.id;

  const [imageData, setImageData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [yearOptions, setYearOptions] = useState([]);

  // Generate year dropdown options
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1864; year--) {
      years.push(year);
    }
    setYearOptions(years);
  }, []);

  // Load image and categories
  useEffect(() => {
    if (!id) {
      setError('No image selected.');
      setLoading(false);
      return;
    }

    fetchImage();
    fetchCategories();
  }, [id]);

  const fetchImage = async () => {
    try {
      const res = await api.get(`/api/images/${id}`);
      setImageData(res.data.image);
      if (res.data.image.thumbnail_path) {
        setPreviewUrl(process.env.REACT_APP_API_URL + res.data.image.thumbnail_path);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch image data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setImageData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setError('Image size should not exceed 3MB');
        return;
      }
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageData?.id) {
      setError('Image data missing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (newImageFile) {
        const formData = new FormData();
        formData.append('title', imageData.title || '');
        formData.append('description', imageData.description || '');
        formData.append('category_id', imageData.category_id || '');
        formData.append('year', imageData.year || '');
        formData.append('location', imageData.location || '');
        formData.append('department', imageData.department || '');
        formData.append('source', imageData.source || '');
        formData.append('keywords', imageData.keywords || '');
        formData.append('image', newImageFile);

        await api.put(`/api/images/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          }
        });
      } else {
        await api.put(`/api/images/${id}`, {
          title: imageData.title,
          description: imageData.description,
          category_id: imageData.category_id,
          year: imageData.year,
          location: imageData.location,
          department: imageData.department,
          source: imageData.source,
          keywords: imageData.keywords
        });
      }

      if (onEditSuccess) {
        onEditSuccess();
      } else {
        navigate('/admin/images');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update image.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (loading && !imageData) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="edit-image">
      {/* <h2>Edit Image</h2> */}

      {error && <Alert variant="danger">{error}</Alert>}

      {imageData && (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={7}>
              {/* Text Inputs */}
              {[
                { name: 'title', label: 'Title *', required: true },
                { name: 'description', label: 'Description', as: 'textarea', rows: 3 },
                { name: 'location', label: 'Location' },
                { name: 'department', label: 'Department' },
                { name: 'source', label: 'Source' },
                { name: 'keywords', label: 'Keywords *', required: true, hint: 'Enter keywords separated by commas' }
              ].map(field => (
                <Form.Group key={field.name} className="mb-3" controlId={field.name}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    as={field.as || 'input'}
                    type="text"
                    rows={field.rows || undefined}
                    name={field.name}
                    value={imageData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                  />
                  {field.hint && (
                    <Form.Text className="text-muted">{field.hint}</Form.Text>
                  )}
                </Form.Group>
              ))}

              {/* Category Select */}
              <Form.Group className="mb-3" controlId="category_id">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category_id"
                  value={imageData.category_id || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Year Select */}
              <Form.Group className="mb-3" controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Select
                  name="year"
                  value={imageData.year || ''}
                  onChange={handleChange}
                >
                  <option value="">Select year</option>
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={5}>
              {/* Image Upload + Preview */}
              <Form.Group className="mb-3" controlId="imageFile">
                <Form.Label>Replace Image</Form.Label>
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    thumbnail
                    alt="Image preview"
                    className="mb-3"
                    style={{ maxHeight: '200px', width: 'auto' }}
                  />
                ) : (
                  <div className="mb-3">No image preview available</div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  Optional: Upload a new image file to replace the existing one.
                </Form.Text>
              </Form.Group>

              {loading && uploadProgress > 0 && (
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
              )}
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" /> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            {/* {onClose && (
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            )} */}
          </div>
        </Form>
      )}
    </div>
  );
};

export default EditImage;
