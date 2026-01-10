import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClassDetailsForm from "../Components/ClassDetailsForm";

const MarkForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  const handleProceed = (classDetails) => {
    navigate("/mark-upload", { state: classDetails });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <h1
        className="text-center mb-4"
        style={{
          fontSize: "23px",
          fontFamily:
            "Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif",
        }}
      >Mark Uploading Form</h1>
      <div className="w-100" style={{ maxWidth: "800px" }}>
        <ClassDetailsForm onProceed={handleProceed} />
      </div>
    </div>
  );
};

export default MarkForm;
