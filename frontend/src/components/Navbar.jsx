import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../style/Navbar.scss';

function AppNavbar() {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="logo">
          Logo
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="mx-auto center-links">
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/login" className="login-link">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
