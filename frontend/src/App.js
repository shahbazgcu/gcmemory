import React, { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import ImageDetailsPage from './pages/ImageDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UploadPage from './pages/UploadPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NotFound from './pages/NotFound';
import EditImage from './pages/admin/EditImage';
import AuthContext from './context/AuthContext'; // 👈 import AuthContext
import './App.css';

function App() {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
  
    // 👇 Redirect to admin dashboard if authenticated admin opens the app
    useEffect(() => {
      if (!loading && isAuthenticated && user?.role === 'admin' && location.pathname === '/') {
        navigate('/admin');
      }
    }, [loading, isAuthenticated, user, navigate, location]);
  
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Container fluid className="px-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/images/:id" element={<ImageDetailsPage />} />
            <Route path="/admin/images/edit/:id" element={<EditImage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes (requires login) */}
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;