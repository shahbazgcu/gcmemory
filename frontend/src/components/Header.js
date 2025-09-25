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
        <Navbar.Brand as={Link} to={logoLink} className="logo me-auto">
          <img 
            src={logo} 
            alt="GCU Memories" 
            className="d-inline-block align-top me-2 img-fluid d-none d-sm-inline"
            style={{
              height: 'auto',
              maxHeight: '60px',
              width: 'auto',
              maxWidth: '290px'
            }}
          />
          <img 
            src={logo} 
            alt="GCU Memories" 
            className="d-inline-block align-top me-2 img-fluid d-inline d-sm-none"
            style={{
              height: 'auto',
              maxHeight: '45px',
              width: 'auto',
              maxWidth: '250px'
            }}
          />
          {/* <span className="fw-bold text-primary">GCU Memories</span> */}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto mb-2 mb-lg-0">
             {/* Only show Gallery link if NOT admin */}
              {user?.role !== 'admin' && (
                <>  
              <Nav.Link as={NavLink} to="/" className="mx-2 px-3">Home</Nav.Link>
             <Nav.Link as={NavLink} to="/about" className="mx-2 px-3">About</Nav.Link>
             <Nav.Link as={NavLink} to="/gallery" className="mx-2 px-3">Gallery</Nav.Link>
             </>
              )}

            {/* {isAuthenticated && (
              <Nav.Link as={NavLink} to="/upload" className="mx-2">
                <FaUpload className="me-1" /> Upload
              </Nav.Link>
            )} */}

            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <FaUser className="me-1" /> 
                    <span className="d-none d-md-inline">{user.name}</span>
                    <span className="d-inline d-md-none">Menu</span>
                  </span>
                } 
                id="user-dropdown"
                align="end"
                className="dropdown-menu-end"
              >
                <NavDropdown.Item as={Link} to="/profile">Change Your Password</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {/* <Nav.Link as={Link} to="/login" className="mx-1">
                  <FaSignInAlt className="me-1" /> Login
                </Nav.Link> */}
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