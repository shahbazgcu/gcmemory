import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { FaUpload, FaUser, FaSignInAlt,  FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.png'; // Adjust the path as necessary

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  // Use '/admin' for admins, '/' for others
  const logoLink = user?.role === 'admin' ? "/admin/" : "/";

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to={logoLink} className="logo">
          <img 
            src={logo} 
            alt="GCU Memories" 
            className="d-inline-block align-top me-2 img-fluid"
            style={{
              height: 'auto',
              maxHeight: '60px',
              width: 'auto',
              maxWidth: '290px'
            }}
          />
          {/* <span className="fw-bold text-primary">GCU Memories</span> */}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
             {/* Only show Gallery link if NOT admin */}
              {user?.role !== 'admin' && (
                <>  
              <Nav.Link as={NavLink} to="/" className="mx-2">Home</Nav.Link>
             <Nav.Link as={NavLink} to="/about" className="mx-2">About</Nav.Link>
             <Nav.Link as={NavLink} to="/gallery" className="mx-2">Gallery</Nav.Link>
             </>
              )}

            {/* {isAuthenticated && (
              <Nav.Link as={NavLink} to="/upload" className="mx-2">
                <FaUpload className="me-1" /> Upload
              </Nav.Link>
            )} */}
            
          </Nav>

          {/* Search bar removed here */}

          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <FaUser className="me-1" /> {user.name}
                  </span>
                } 
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">Change Your Password</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="mx-1">
                  <FaSignInAlt className="me-1" /> Login
                </Nav.Link>
                {/* <Nav.Link as={Link} to="/register" className="mx-1">
                  <FaUserPlus className="me-1" /> Register
                </Nav.Link> */}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;