import React from "react";
import { Navbar as BsNavbar, Nav, Container, OverlayTrigger, Tooltip, Dropdown, Offcanvas, Badge } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Assets/Logo.png";
import { FaUserCircle, FaBars } from "react-icons/fa";
import './Navbar.css'; // Custom CSS file

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      {/* MAIN NAVBAR */}
      <BsNavbar expand="lg" className="ultimate-navbar py-3 shadow-lg">
        <Container>
          {/* LOGO & BRAND */}
          <div style={{ fontSize: '56px' }}>🎓</div>
          <BsNavbar.Brand href="/" className="navbar-brand-custom d-flex align-items-center">
              
            <span className="brand-text">KCET AI ERP</span>
          </BsNavbar.Brand>

          {/* TOGGLE */}
          <BsNavbar.Toggle aria-controls="navbar-nav" className="navbar-toggle-custom">
            <FaBars size={24} />
          </BsNavbar.Toggle>

          <BsNavbar.Collapse id="navbar-nav" className="justify-content-between">
            
            {/* MAIN NAV */}
            <Nav className="main-nav mx-auto">
              <Nav.Link as={NavLink} to="/" className="nav-pill" activeClassName="active">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/attendance-form" className="nav-pill" activeClassName="active">
                Attendance
              </Nav.Link>
              <Nav.Link as={NavLink} to="/mark-form" className="nav-pill" activeClassName="active">
                Marks
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about-us" className="nav-pill" activeClassName="active">
                About
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact" className="nav-pill" activeClassName="active">
                Contact
              </Nav.Link>
            </Nav>

            {/* AUTH SECTION */}
            <div className="auth-section d-flex align-items-center gap-3">
              
            {/* CONDITIONAL LOGIN/LOGOUT BUTTON */}
            {user ? (
              <Nav.Link onClick={handleLogout} className="auth-btn logout-btn">
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/login" className="auth-btn login-btn">
                Login
              </Nav.Link>
            )}

              {/* USER PROFILE */}
              <Dropdown>
                <Dropdown.Toggle 
                  as="div" 
                  className="user-dropdown-toggle"
                  id="user-dropdown"
                >
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="user-tooltip">
                        {user ? `${user.email}` : "Sign in to continue"}
                      </Tooltip>
                    }
                  >
                    <FaUserCircle className="user-icon" />
                  </OverlayTrigger>
                </Dropdown.Toggle>

                <Dropdown.Menu className="user-dropdown-menu shadow-lg">
                  {user ? (
                    <>
                      <Dropdown.Header className="user-email">
                        {user.email}
                      </Dropdown.Header>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="logout-item">
                        🚪 Logout
                      </Dropdown.Item>
                    </>
                  ) : (
                    <Dropdown.Item onClick={() => navigate('/login')} className="login-dropdown-item">
                      🔐 Quick Sign In
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </>
  );
};

export default Navbar;
