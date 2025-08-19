import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaImages } from "react-icons/fa";
import api from "../utils/api";
import ImageGallery from "../components/ImageGallery";
import "./HomePage.css";
import aboutArchiveImg from "../assets/about-archive.jpg";

const HomePage = () => {
  const [featuredImages, setFeaturedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const heroImageIds = [1, 7, 4, 5]; // Customize these IDs based on your database

    const fetchHeroImages = async () => {
      try {
        const responses = await Promise.all(
          heroImageIds.map((id) => api.get(`/api/images/${id}`))
        );

        const baseUrl = process.env.REACT_APP_API_URL;

        const images = responses.map((res) => {
          const image = res.data.image;
          console.log("Raw image object:", image);

          return {
            id: image.id,
            url: `${baseUrl}${image.image_path}`, // ✅ Correct path
          };
        });

        console.log("✅ Fetched Hero Images:", images);
        setHeroImages(images);
      } catch (error) {
        console.error("Error fetching hero images:", error);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const imagesRes = await api.get("/api/images?limit=8");
        setFeaturedImages(imagesRes.data.images);

        const categoriesRes = await api.get("/api/categories");
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <Container>
          <Row className="align-items-center py-5">
            <Col md={8} className="mb-4 mb-md-0">
              <p className="hero-subtitle">
                Archiving the Past, Preserving the Future.
              </p>
              <p className="hero-text">
                Welcome to our digital archive — a dedicated portal to preserve,
                celebrate, and share the rich history of our institute through
                photographs. This platform was created to safeguard the
                cherished memories, milestones, and moments that have shaped our
                journey.
              </p>
            </Col>
            <Col md={4}>
              <div className="hero-image-grid">
                {heroImages.map((image) => (
                  <div
                    key={image.id}
                    className="hero-image"
                    style={{
                      backgroundImage: image.url
                        ? `url(${image.url})`
                        : "url('/fallback.jpg')",
                    }}
                  >
                    {!image.url && (
                      <span className="fallback-text">Image not available</span>
                    )}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Images Section */}
      <section className="featured-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Recent Memories</h2>
            <Link to="/gallery" className="view-all">
              View All <FaImages className="ms-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ImageGallery images={featuredImages} />
          )}
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <Container>
          <h2 className="section-title">Browse by Category</h2>
          <Row>
            {categories.map((category) => (
              <Col key={category.id} md={4} lg={3} className="mb-4">
                <Link
                  to={`/gallery?category_id=${category.id}`}
                  className="category-link"
                >
                  <Card className="category-card">
                    <Card.Body>
                      <Card.Title>{category.name}</Card.Title>
                      <Card.Text>{category.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h2 className="about-title">About the Archive</h2>
              <p>
                The GCU Memories Archive Portal is dedicated to preserving and
                sharing the rich history of Government College University. Our
                digital collection includes photographs, documents, and media
                spanning over decades of academic excellence, cultural events,
                and campus life.
              </p>
              <p>
                This platform enables students, alumni, faculty, and the public
                to explore, contribute to, and celebrate the heritage of one of
                Pakistan's oldest and most prestigious educational institutions.
              </p>
              <Link to="/about">
                <Button  variant="primary">Learn More</Button>
              </Link>
            </Col>
            <Col md={6}>
              <div className="p-5">
                <img
                  src={aboutArchiveImg}
                  alt="About the Archive"
                  className="img-fluid about-image"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
