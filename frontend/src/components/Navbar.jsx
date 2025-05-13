import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../style/Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


function AppNavbar() {
  const navigate = useNavigate();
  return (
    <Navbar expand="lg" className="custom-navbar fixed-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="logo">
          Logo
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="mx-auto center-links">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/add-to-cart" className="cart">
              <FontAwesomeIcon 
                icon={faCartShopping}
                color='white'
              />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/login" className="login-link">Login</Nav.Link>
            <div style={{ display: 'flex', gap: '25px', alignItems:'center', marginLeft:'15px' }}>
              <FontAwesomeIcon icon={faUser} size="x" color="#f90348" title="User Profile"  onClick={() => navigate('/dashboard/profile')}/>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
