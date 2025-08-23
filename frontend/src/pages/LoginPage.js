import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import AuthContext from "../context/AuthContext";
import "./LoginPage.css";

const LoginPage = ({ showToast }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login, loading, error, clearError, isAuthenticated, user } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user && user.role === "admin") {
        navigate("/admin/");
      } else {
        const redirectPath = location.state?.from || "/";
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, navigate, location.state, user]);

  // Show toast when error occurs
  useEffect(() => {
    if (error) {
      showToast(error, "danger" );
    }
  }, [error, showToast]);

  // Clear errors on mount/unmount
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError("");
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      showToast("Please fill in all required fields.", "warning" );
      return;
    }

    setValidated(true);

    const result = await login({ email, password });

    if (result.success) {
      showToast("Login successful", "success" );
      // Redirect handled by useEffect
    } else {
      showToast("Invalid credentials", "danger" );
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="login-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">
                    <FaSignInAlt className="me-2" /> Login
                  </h2>
                  <p className="text-muted">Access your GCU Memories account</p>
                </div>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid email address.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 6 characters long.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={loading}
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
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
