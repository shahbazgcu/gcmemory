import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const Root = () => {
  // 🔥 Global toast state moved here
  const [toast, setToast] = useState({
    show: false,
    message: '',
    bg: 'success',
  });

  const showToast = (message, bg = 'success') => {
    setToast({ show: true, message, bg });
  };

  return (
    <BrowserRouter>
      <AuthProvider showToast={showToast}>
        <App showToast={showToast} />

      {/* Global Toast Container */}
<ToastContainer position="top-end" className="p-3">
  <Toast
    className={`custom-toast border-0 shadow-lg rounded-3`}
    bg={toast.bg}
    onClose={() => setToast({ ...toast, show: false })}
    show={toast.show}
    delay={3000}
    autohide
  >
    <Toast.Body className="text-white fw-bold">
      🚀 {toast.message}
    </Toast.Body>
  </Toast>
</ToastContainer>

      </AuthProvider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
