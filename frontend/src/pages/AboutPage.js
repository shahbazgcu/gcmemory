import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import aboutImg1 from "../assets/about1.jpg";
import aboutImg2 from "../assets/about2.jpg";

const AboutPage = () => {
  return (
    <section className="about-page">
      <Container className="my-5">
        {/* First Row */}
        <Row className="align-items-center mb-5">
          <Col md={7}>
            <h2>About Government College University (GCU)</h2>
            <p>
              Established in 1864, Government College University (GCU) Lahore is
              one of the oldest and most prestigious institutions of higher
              learning in Pakistan. Known for its academic excellence,
              distinguished alumni, and rich cultural traditions, GCU has been a
              beacon of knowledge and progress for generations.
            </p>
            <p>
              Over the years, GCU has nurtured poets, scientists, thinkers, and
              leaders who have contributed to the academic, political, and
              cultural fabric of the nation.
            </p>
          </Col>
          <Col md={5}>
            <img
              src={aboutImg1}
              alt="Government College University"
              className="img-fluid rounded shadow about-image"
            />
          </Col>
        </Row>

        {/* Second Row */}
        <Row className="align-items-center">
          <Col md={7} className="order-md-2 mb-4 mb-md-0">
            <h2>About the GCU Memories Archive Portal</h2>
            <p>
              The GCU Memories Archive Portal is dedicated to collecting,
              preserving, and sharing the historical treasures of GCU. From rare
              photographs and archival documents to videos and oral histories,
              the portal serves as a digital time capsule of GCU’s vibrant past.
            </p>
            <p>
              It invites students, alumni, faculty, and the public to explore
               to the university’s legacy. Whether it’s a
              black-and-white snapshot from the 1950s or a student event from
              recent years, every memory matters.
            </p>
            <Link to="/gallery">
              <Button variant="primary">Explore the Archive</Button>
            </Link>
          </Col>
          <Col md={5} className="order-md-1">
            <img
              src={aboutImg2}
              alt="GCU Archive"
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutPage;
