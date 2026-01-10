import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import HomeSidePic from '../assets/Home_Page.png';
import './Home.css'; // Custom CSS

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* BACKGROUND FLOATING ORBS */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>

      <Container className="hero-container">
        <Row className="hero-row align-items-center min-vh-100">
          
          {/* LEFT CONTENT */}
          <Col lg={6} className="hero-content">
            <h1 className="hero-title">
              Smart Attendance & <br/>
              <span className="hero-highlight">Mark Management</span>
            </h1>
            
            <p className="hero-subtitle">
              Transform academic workflows with cutting-edge AI.{' '}
              <strong>99.9% accurate face recognition</strong> for attendance 
              and automatic mark processing.
            </p>

            {/* CTA BUTTONS */}
            <div className="cta-buttons">
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
