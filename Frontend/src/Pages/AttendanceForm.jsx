import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClassDetailsForm from "../Components/ClassDetailsForm";

const AttendanceForm = () => {
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
  navigate("/attendance-upload", { state: classDetails });
};


  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="w-100">
        <ClassDetailsForm onProceed={handleProceed} />
        <br />
      </div>
    </div>
  );
};

export default AttendanceForm;
