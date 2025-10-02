import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeSidePic from '../assets/Home_Page.png';
import "../styles/global.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h1 className="display-4 fw-bold homeHead">AI Automation Mark Management and Attendance Automation</h1>
          <p className="lead text-muted" style={{ fontFamily: "cursive", fontSize: "18px" }}>
            Simplify your academic processes with seamless attendance tracking and automatic mark capturing powered by AI technology.
          </p>
          <br />
          <button
            className="btn btn-outline-danger btn-lg"
            onClick={() => navigate('/attendance-form')}
          >
            Attendance
          </button>
          <button
            className="btn btn-outline-danger btn-lg ms-3"
            onClick={() => navigate('/mark-form')}
          >
            Mark Upload
          </button>
        </div>
        <div className="col-lg-6 d-flex justify-content-center">
          <img
            src={HomeSidePic}
            alt="Automation Illustration"
            className="rounded-5 shadow"
            style={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}
            width="500"
            height="600"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
