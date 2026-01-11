import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import "./ClassDetailsForm.css";

const departments = [
  "CSE",
  "IT",
  "AI & DS",
  "MECH",
  "EEE",
  "ECE",
  "Civil",
  "Mechatronics",
  "Biotech",
];

const ClassDetailsForm = ({ onProceed }) => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [period, setPeriod] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!year) newErrors.year = "Please select a year";
    if (!department) newErrors.department = "Please select a department";
    if (!section) newErrors.section = "Please select a section";
    if (!period) newErrors.period = "Please select a period";
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
      onProceed({ year, department, section, period });
      setShowSuccess(false);
    }, 1500);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="ultimate-form-card shadow-lg border-0">
            <Card.Body className="p-5">
              {/* HEADER */}
              <div className="text-center mb-5">
                <h3 className="form-title mb-1">Class Selection</h3>
                <p className="form-subtitle mb-0">
                  Choose class & period to proceed
                </p>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                {/* YEAR */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                    Select Year
                  </Form.Label>

                  {[1, 2, 3, 4].map((y) => (
                    <Form.Check
                      key={y}
                      type="radio"
                      name="year"
                      label={
                        y === 1
                          ? "1st Year"
                          : y === 2
                          ? "2nd Year"
                          : y === 3
                          ? "3rd Year"
                          : "4th Year"
                      }
                      value={String(y)}
                      checked={year === String(y)}
                      onChange={(e) => setYear(e.target.value)}
                      style={{
                        fontWeight:
                          year === String(y) ? "bold" : "normal",
                        marginBottom: "10px",
                      }}
                    />
                  ))}

                  {errors.year && (
                    <div className="text-danger">{errors.year}</div>
                  )}
                </Form.Group>

                {/* DEPARTMENT */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                    Select Department
                  </Form.Label>

                  <Form.Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={
                      errors.department ? "is-invalid" : ""
                    }
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </Form.Select>

                  {errors.department && (
                    <div className="text-danger">
                      {errors.department}
                    </div>
                  )}
                </Form.Group>

                {/* SECTION */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                    Select Section
                  </Form.Label>

                  {["A", "B", "C"].map((s) => (
                    <Form.Check
                      key={s}
                      type="radio"
                      name="section"
                      label={`Section ${s}`}
                      value={s}
                      checked={section === s}
                      onChange={(e) => setSection(e.target.value)}
                      style={{
                        fontWeight:
                          section === s ? "bold" : "normal",
                        marginBottom: "10px",
                      }}
                    />
                  ))}

                  {errors.section && (
                    <div className="text-danger">
                      {errors.section}
                    </div>
                  )}
                </Form.Group>

                {/* 🔥 PERIOD */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                    Select Period
                  </Form.Label>

                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <Button
                        key={p}
                        type="button"
                        variant={
                          period === p
                            ? "success"
                            : "outline-secondary"
                        }
                        className="px-4 py-2 fw-bold rounded-pill"
                        onClick={() => setPeriod(p)}
                        style={{
                          minWidth: "90px",
                          boxShadow:
                            period === p
                              ? "0 4px 12px rgba(40,167,69,0.4)"
                              : "none",
                        }}
                      >
                        Period {p}
                      </Button>
                    ))}
                  </div>

                  {errors.period && (
                    <div className="text-danger text-center mt-2">
                      {errors.period}
                    </div>
                  )}
                </Form.Group>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  className="w-100 ultimate-submit-btn"
                  disabled={
                    !year || !department || !section || !period
                  }
                >
                  {showSuccess ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
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
