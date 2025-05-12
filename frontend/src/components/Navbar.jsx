import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../style/Navbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faShoppingCart, faUser, faUserAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { decodedToken } from '../Services/getToken ';


function AppNavbar() {
  const [userId, setUserId] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const decoded = decodedToken();
    setUserId(decoded?.userId);
  }, []);

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
          <Nav className="ms-auto ">
            {userId && <Nav.Link as={NavLink} to="/add-to-cart" className="cart">
              <FontAwesomeIcon 
                icon={faCartShopping}
                color="#f90348" 
                size='xl'
              />
            </Nav.Link>}
            {!userId && <Nav.Link as={NavLink} to="/login" className="login-link">Login</Nav.Link>}
            {userId && <div style={{ display: 'flex', gap: '25px', alignItems:'center', marginLeft:'15px', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faUserAlt} size="2x" color="#f90348" title="User Profile"  onClick={() => navigate('/dashboard')}/>
            </div>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
