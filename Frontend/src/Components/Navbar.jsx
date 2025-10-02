import React from "react";
import { Navbar as BsNavbar, Nav, Container, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom"; // use next/link if Next.js
import Logo from "../Assets/Logo.png";
import { FaUserCircle } from "react-icons/fa";
const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <BsNavbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        {/* Logo + Brand Name */}
        <BsNavbar.Brand href="/" className="d-flex align-items-center">
          <img
            src={Logo}
            className="rounded-circle"
            alt="Logo"
            height="60"
            width="60"
          />
          <span className="ms-2" style={{ fontFamily: "cursive", fontSize: "18px" }}>
            <b>KCET AI ERP</b>
          </span>
        </BsNavbar.Brand>

        {/* Mobile Toggle */}
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible Nav Links */}
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto" style={{ gap: "23px" }}>
            <Nav.Link as={NavLink} to="/" className="nav_text" style={{ fontSize: "22px" }}>
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/attendance-form"
              className="nav_text"
              style={{ fontSize: "22px" }}
            >
              Attendance
            </Nav.Link>
            <Nav.Link as={NavLink} to="/mark-form" className="nav_text" style={{ fontSize: "22px" }}>
              Mark
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/about-us"
              className="nav_text"
              style={{ fontSize: "22px" }}
            >
              About Us
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/contact"
              className="nav_text"
              style={{ fontSize: "22px" }}
            >
              Contact
            </Nav.Link>
          </Nav>

          {/* Right side (Auth links) */}
          <Nav className="ms-auto" style={{ gap: "23px" }}>
            <Nav.Link as={NavLink} to="/signup" className="nav_text" style={{ fontSize: "22px" }}>
              Sign Up
            </Nav.Link>
            <Nav.Link as={NavLink} to="/login" className="nav_text" style={{ fontSize: "22px" }}>
              Login
            </Nav.Link>
            <Dropdown>
              <Dropdown.Toggle as="span" style={{ border: 'none', background: 'none' }}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="user-tooltip">
                      {user ? user.email : "Please login first"}
                    </Tooltip>
                  }
                >
                  <FaUserCircle size={32} className="mt-2" color="black" style={{ cursor: "pointer" }} />
                </OverlayTrigger>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {user ? (
                  <>
                    <Dropdown.Item>{user.email}</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item onClick={() => navigate('/login')}>Login</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
