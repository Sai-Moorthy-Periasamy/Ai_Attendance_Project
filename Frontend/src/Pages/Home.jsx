import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HomeSidePic from '../assets/Home_Page.png';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.profession; // admin / staff / student

  return (
    <div className="home-wrapper">
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>

      <Container className="hero-container">
        <Row className="hero-row align-items-center min-vh-100">
          
          {/* LEFT CONTENT */}
          <Col lg={6} className="hero-content">
            <h1 className="hero-title">
              Welcome {role === "admin" ? "Admin" : "Faculty"} 👋 <br/>
              <span className="hero-highlight">
                Smart Attendance & Mark Management
              </span>
            </h1>

            <p className="hero-subtitle">
              {role === "admin"
                ? "Manage users, roles and system configuration."
                : "Mark attendance and upload student marks with ease."}
            </p>

            {/* 🔥 ROLE BASED BUTTONS */}
            <div className="cta-buttons">

              {role === "admin" ? (
                <>
                  <Button
                    size="lg"
                    className="cta-primary-btn me-3 mb-3 mb-lg-0"
                    onClick={() => navigate('/adduser')}
                  >
                    ➕ Add Users
                  </Button>

                  <Button
                    size="lg"
                    className="cta-secondary-btn"
                    variant="outline-light"
                    onClick={() => navigate('/updateuser')}
                  >
                    ✏️ Update Users
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="cta-primary-btn me-3 mb-3 mb-lg-0"
                    onClick={() => navigate('/attendance-form')}
                  >
                    📸 Start Attendance
                  </Button>

                  <Button
                    size="lg"
                    className="cta-secondary-btn"
                    variant="outline-light"
                    onClick={() => navigate('/mark-form')}
                  >
                    📊 Upload Marks
                  </Button>
                </>
              )}

            </div>
          </Col>

          {/* RIGHT IMAGE */}
          <Col lg={6} className="hero-image-col">
            <div className="image-container">
              <img
                src={HomeSidePic}
                alt="AI Attendance System"
                className="hero-image"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
