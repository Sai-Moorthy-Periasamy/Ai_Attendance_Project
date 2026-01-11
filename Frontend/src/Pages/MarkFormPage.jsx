import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MarkForm from "../Components/MarkForm";

const MarkFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  const handleProceed = (markDetails) => {
    // Save the class/course details in localStorage
    localStorage.setItem("markFormDetails", JSON.stringify(markDetails));

    // Redirect to the marks upload page
    navigate("/marks-upload", { state: markDetails });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="w-100">
        <MarkForm onProceed={handleProceed} />
        <br />
      </div>
    </div>
  );
};

export default MarkFormPage;
