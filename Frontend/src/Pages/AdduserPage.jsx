import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from "react-bootstrap";
import './AdduserPage.css';

const AdduserPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    rollno: "",
    email: "",
    password: "",
    profession: "staff",
    year: "",
    dept: "",
    section: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // VALIDATION FUNCTION
  const validateForm = (f = form) => {
    const newErrors = {};

    if (!f.name.trim()) newErrors.name = "Name is required";
    else if (f.name.length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!f.rollno.trim()) newErrors.rollno = "Roll No is required";

    if (!f.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) newErrors.email = "Email is invalid";

    if (!f.password) newErrors.password = "Password is required";
    else if (f.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (f.profession === "student") {
      if (!f.year) newErrors.year = "Year is required for students";
      if (!f.dept) newErrors.dept = "Department is required for students";
      if (!f.section) newErrors.section = "Section is required for students";
    }

    return newErrors;
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    // Reset student fields when profession changes
    if (name === "profession" && value !== "student") {
      updatedForm = {
        ...updatedForm,
        year: "",
        dept: "",
        section: "",
      };
    }

    setForm(updatedForm);
    setErrors(validateForm(updatedForm));
  };

  // HANDLE SUBMIT
  const handleAdduser = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        rollno: form.rollno,
        email: form.email,
        password: form.password,
        profession: form.profession,
        year: form.profession === "student" ? form.year : null,
        dept: form.profession === "student" ? form.dept : null,
        section: form.profession === "student" ? form.section : null,
      };

      await axios.post("http://localhost:5000/adduser", payload);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrors({ submit: err.response?.data?.error || "Failed to create account. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adduser-wrapper">
      <Container className="py-5 min-vh-100 d-flex align-items-center">
        <Row className="justify-content-center">
          <Col md={12} lg={12} xl={12} xxl={12} className="mx-auto">
            <Card className="ultimate-auth-card border-0 shadow-lg">
              <Card.Body className="p-5 p-lg-6">
                
                {/* HEADER */}
                <div className="text-center mb-5">
                  <div className="auth-header-icon mb-4"></div>
                  <h2 className="auth-title mb-2">Create New Account</h2>
                  <p className="auth-subtitle mb-0">
                    Join KCET AI ERP - Complete your profile
                  </p>
                  <Badge bg="success" className="mt-3 profession-badge">
                    {form.profession === "staff" ? "👨‍🏫 Staff" : 
                     form.profession === "student" ? "🎓 Student" : "⚙️ Admin"}
                  </Badge>
                </div>

                <Form onSubmit={handleAdduser} noValidate>
                  
                  {/* PROFESSION SELECTOR */}
                  <Form.Group className="mb-5">
                    <Form.Label className="form-label">
                      <span className="label-icon">👤</span>
                      Account Type
                    </Form.Label>
                    <Form.Select
                      name="profession"
                      value={form.profession}
                      onChange={handleChange}
                      className="ultimate-select"
                      isInvalid={!!errors.profession}
                    >
                      <option value="staff">👨‍🏫 Staff (Teacher)</option>
                      <option value="student">🎓 Student</option>
                      <option value="admin">⚙️ Admin</option>
                    </Form.Select>
                  </Form.Group>

                  {/* COMMON FIELDS */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label">
                          <span className="label-icon">📛</span>
                          Full Name
                        </Form.Label>
                        <Form.Control
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          className="ultimate-input"
                          isInvalid={!!errors.name}
                          placeholder="Enter full name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label">
                          <span className="label-icon">🆔</span>
                          Roll No / ID
                        </Form.Label>
                        <Form.Control
                          name="rollno"
                          type="text"
                          value={form.rollno}
                          onChange={handleChange}
                          className="ultimate-input"
                          isInvalid={!!errors.rollno}
                          placeholder="Enter roll number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.rollno}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label">
                          <span className="label-icon">📧</span>
                          Email
                        </Form.Label>
                        <Form.Control
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="ultimate-input"
                          isInvalid={!!errors.email}
                          placeholder="student@kcet.edu.in"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col lg={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label">
                          <span className="label-icon">🔒</span>
                          Password
                        </Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          className="ultimate-input"
                          isInvalid={!!errors.password}
                          placeholder="At least 6 characters"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* STUDENT FIELDS */}
                  {form.profession === "student" && (
                    <div className="student-fields">
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-4">
                            <Form.Label className="form-label">
                              <span className="label-icon">📚</span>
                              Year
                            </Form.Label>
                            <Form.Select
                              name="year"
                              value={form.year}
                              onChange={handleChange}
                              className="ultimate-select"
                              isInvalid={!!errors.year}
                            >
                              <option value="">Select Year</option>
                              <option value="1">1st Year</option>
                              <option value="2">2nd Year</option>
                              <option value="3">3rd Year</option>
                              <option value="4">4th Year</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col md={4}>
                          <Form.Group className="mb-4">
                            <Form.Label className="form-label">
                              <span className="label-icon">🏛️</span>
                              Dept
                            </Form.Label>
                            <Form.Select
                              name="dept"
                              value={form.dept}
                              onChange={handleChange}
                              className="ultimate-select"
                              isInvalid={!!errors.dept}
                            >
                              <option value="">Select Dept</option>
                              <option value="CSE">CSE</option>
                              <option value="IT">IT</option>
                              <option value="AI & DS">AI & DS</option>
                              <option value="ECE">ECE</option>
                              <option value="EEE">EEE</option>
                              <option value="MECH">MECH</option>
                              <option value="CIVIL">CIVIL</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col md={4}>
                          <Form.Group className="mb-4">
                            <Form.Label className="form-label">
                              <span className="label-icon">📋</span>
                              Section
                            </Form.Label>
                            <Form.Select
                              name="section"
                              value={form.section}
                              onChange={handleChange}
                              className="ultimate-select"
                              isInvalid={!!errors.section}
                            >
                              <option value="">Select Section</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <Button
                    type="submit"
                    className="w-100 ultimate-submit-btn mt-4"
                    disabled={loading || success} // ✅ Only disable during loading or after success
                  >
                    {loading && (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating Account...
                      </>
                    )}
                    {success ? "✅ Account Created!" : "🚀 Create Account"}
                  </Button>

                  {errors.submit && (
                    <Alert variant="danger" className="mt-4 ultimate-alert animate__animated animate__shakeX">
                      {errors.submit}
                    </Alert>
                  )}
                </Form>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdduserPage;
