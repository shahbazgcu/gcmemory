import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { FaUpload, FaImage } from "react-icons/fa";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";
import "./UploadPage.css";

const UploadPage = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    year: "",
    location: "",
    department: "",
    source: "",
    keywords: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [yearOptions, setYearOptions] = useState([]);

  // 🔹 Ref for clearing file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1864; year--) {
      years.push(year);
    }
    setYearOptions(years);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please refresh the page.");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        setError("Image size should not exceed 3MB");
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!imageFile) {
      setError("Please select an image file to upload");
      return;
    }

    setValidated(true);
    setLoading(true);
    setUploadProgress(0);
    setError(null);
    setSuccessMessage(null);

    try {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);
      uploadData.append("title", formData.title);
      if (formData.description)
        uploadData.append("description", formData.description);
      if (formData.category_id)
        uploadData.append("category_id", formData.category_id);
      if (formData.year) uploadData.append("year", formData.year);
      if (formData.location) uploadData.append("location", formData.location);
      if (formData.department)
        uploadData.append("department", formData.department);
      if (formData.source) uploadData.append("source", formData.source);
      if (formData.keywords) uploadData.append("keywords", formData.keywords);

      await api.post("/api/images", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      });

      setSuccessMessage("Image uploaded successfully.");

      // Reset form fields
      setFormData({
        title: "",
        description: "",
        category_id: "",
        year: "",
        location: "",
        department: "",
        source: "",
        keywords: "",
      });
      setImageFile(null);
      setPreviewUrl("");
      setValidated(false);
      setUploadProgress(0);
      setLoading(false);

      // 🔹 Clear file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error("Error uploading image:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="upload-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="upload-title">
                    <FaUpload className="me-2" /> Upload Memory
                  </h2>
                  <p className="text-muted">
                    Share your GCU memories with the community
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={7}>
                      <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title*</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          placeholder="Enter a title for your memory"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a title.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          placeholder="Describe this memory..."
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category *</Form.Label>
                            <Form.Select
                              name="category_id"
                              value={formData.category_id}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Please select a category.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="year">
                            <Form.Label>Year</Form.Label>
                            <Form.Select
                              name="year"
                              value={formData.year}
                              onChange={handleChange}
                  
                            >
                              <option value="">Select year</option>
                              {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                              Please select a year.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                              type="text"
                              name="location"
                              placeholder="Where was this photo taken?"
                              value={formData.location}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3" controlId="department">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                              type="text"
                              name="department"
                              placeholder="Related department"
                              value={formData.department}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3" controlId="source">
                        <Form.Label>Source</Form.Label>
                        <Form.Control
                          type="text"
                          name="source"
                          placeholder="Where did you get this image?"
                          value={formData.source}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="keywords">
                        <Form.Label>Keywords *</Form.Label>
                        <Form.Control
                          type="text"
                          name="keywords"
                          placeholder="Enter keywords separated by commas"
                          value={formData.keywords}
                          onChange={handleChange}
                          required
                        />
                        <Form.Text className="text-muted">
                          Add keywords to make your image easier to find
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={5}>
                      <div className="upload-preview-container mb-3">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="upload-preview-image"
                          />
                        ) : (
                          <div className="upload-placeholder">
                            <FaImage className="upload-placeholder-icon" />
                            <p>Image Preview</p>
                          </div>
                        )}
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Label>Select Image File*</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          ref={fileInputRef}   // 🔹 Ref added here
                        />
                        <Form.Text className="text-muted">
                          Maximum file size: 3MB. Supported formats: JPEG, PNG,
                          GIF
                        </Form.Text>
                      </Form.Group>

                      {loading && uploadProgress > 0 && (
                        <div className="mb-3">
                          <ProgressBar
                            now={uploadProgress}
                            label={`${uploadProgress}%`}
                            variant="primary"
                          />
                        </div>
                      )}
                    </Col>
                  </Row>

                  <div className="d-grid mt-3">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="upload-btn"
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="me-2" /> Upload Memory
                        </>
                      )}
                    </Button>
                  </div>

                  {successMessage && (
                    <Alert variant="success" className="mt-3">
                      {successMessage}
                    </Alert>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UploadPage;
