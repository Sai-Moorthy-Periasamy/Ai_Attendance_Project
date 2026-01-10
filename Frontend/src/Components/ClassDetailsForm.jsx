import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Alert } from "react-bootstrap";
import './ClassDetailsForm.css';

const departments = [
  "CSE", "IT", "AI & DS", "MECH", "EEE", "ECE", "Civil", "Mechtronics", "Biotech",
];

const ClassDetailsForm = ({ onProceed }) => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!year) newErrors.year = "Please select a year";
    if (!department) newErrors.department = "Please select a department";
    if (!section) newErrors.section = "Please select a section";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setShowSuccess(true);
    setTimeout(() => {
      onProceed({ year, department, section });
      setShowSuccess(false);
    }, 1500);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="ultimate-form-card shadow-lg border-0">
            <Card.Body className="p-5">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="form-header-icon mb-3"></div>
                <h3 className="form-title mb-1">Class Selection</h3>
                <p className="form-subtitle mb-0">
                  Choose your class details to proceed
                </p>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                {/* YEAR */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                     Select Year
                  </Form.Label>
                  <div className="year-options">
                    {[1, 2, 3, 4].map((y) => (
                      <Form.Check
                        key={y}
                        type="radio"
                        id={`year${y}`}
                        name="year"
                        label={y === 1 ? "1st Year" : y === 2 ? "2nd Year" : y === 3 ? "3rd Year" : "4th Year"}
                        value={String(y)}
                        checked={year === String(y)}
                        onChange={(e) => setYear(e.target.value)}
                        style={{
                          color: "black",
                          fontWeight: year === String(y) ? "bold" : "normal",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                  </div>
                  <Form.Control.Feedback type="invalid">{errors.year}</Form.Control.Feedback>
                </Form.Group>

                {/* DEPARTMENT */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                    Select Department
                  </Form.Label>
                  <Form.Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`ultimate-select ${errors.department ? 'is-invalid' : ''}`}
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.department}</Form.Control.Feedback>
                </Form.Group>

                {/* SECTION */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                   Select Section
                  </Form.Label>
                  <div className="section-options">
                    {["A", "B", "C"].map((s) => (
                      <Form.Check
                        key={s}
                        type="radio"
                        id={`section${s}`}
                        name="section"
                        label={`Section ${s}`}
                        value={s}
                        checked={section === s}
                        onChange={(e) => setSection(e.target.value)}
                        style={{
                          color: "black",
                          fontWeight: section === s ? "bold" : "normal",
                          marginBottom: "10px",
                        }}
                      />
                    ))}
                  </div>
                  <Form.Control.Feedback type="invalid">{errors.section}</Form.Control.Feedback>
                </Form.Group>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  className="w-100 ultimate-submit-btn"
                  disabled={!year || !department || !section}
                >
                  {showSuccess ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Proceeding...
                    </>
                  ) : (
                    "Proceed to Attendance"
                  )}
                </Button>
              </Form>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClassDetailsForm;
