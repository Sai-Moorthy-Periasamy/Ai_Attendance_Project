import React, { useState } from "react";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import "./ClassDetailsForm.css";

const departments = [
  "CSE", "IT", "AI & DS", "MECH", "EEE", "ECE", "Civil", "Mechatronics", "Biotech",
];

const categories = [
  "Cycle Test - 1", "Cycle Test - 2", "Skill Mark", "MCQ Test", "Seminar Mark", "Assignment"
];

const courseOptions = [
  "cs2501 - Internet and Security",
  "cs2502 - Machine Learning", 
  "cs2503 - Network Essential",
  "cs2504 - Full stack Development",
  "cs2505 - Internet Of Things"
];

const MarkForm = ({ onProceed }) => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(""); // 🔥 NEW: Track full course string
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔥 FIXED: Course change handler
  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);
    
    if (selected) {
      const [id, name] = selected.split(' - ');
      setCourseId(id.trim());
      setCourseName(name.trim());
    } else {
      setCourseId("");
      setCourseName("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!year) newErrors.year = "Please select a year";
    if (!department) newErrors.department = "Please select a department";
    if (!section) newErrors.section = "Please select a section";
    if (!courseId) newErrors.courseId = "Please select a course";
    if (!category) newErrors.category = "Please select a category";
    return newErrors;
  };

  // 🔥 FIXED: Button enable logic
  const isFormValid = year && department && section && courseId && category;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowSuccess(true);

    const data = {
      year,
      department,
      section,
      courseId,
      courseName,
      category,
      selectedCourse // 🔥 Include full course string
    };

    setTimeout(() => {
      onProceed(data);
      setShowSuccess(false);
    }, 1500);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="ultimate-form-card shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-5">
                <h3 className="form-title mb-1">Mark Entry Setup</h3>
                <p className="form-subtitle mb-0">
                  Select class, course & category details
                </p>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                {/* YEAR */}
                <Form.Group className="mb-4">
                  <Form.Label className="section-label">Select Year</Form.Label>
                  {[1, 2, 3, 4].map((y) => (
                    <Form.Check
                      key={y}
                      type="radio"
                      name="year"
                      label={
                        y === 1 ? "1st Year" :
                        y === 2 ? "2nd Year" :
                        y === 3 ? "3rd Year" : "4th Year"
                      }
                      value={String(y)}
                      checked={year === String(y)}
                      onChange={(e) => setYear(e.target.value)}
                      style={{
                        fontWeight: year === String(y) ? "bold" : "normal",
                        marginBottom: "10px",
                      }}
                    />
                  ))}
                  {errors.year && <div className="text-danger">{errors.year}</div>}
                </Form.Group>

                {/* DEPARTMENT */}
                <Form.Group className="mb-4">
                  <Form.Label className="section-label">Select Department</Form.Label>
                  <Form.Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={errors.department ? "is-invalid" : ""}
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </Form.Select>
                  {errors.department && (
                    <div className="text-danger">{errors.department}</div>
                  )}
                </Form.Group>

                {/* SECTION */}
                <Form.Group className="mb-4">
                  <Form.Label className="section-label">Select Section</Form.Label>
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
                        fontWeight: section === s ? "bold" : "normal",
                        marginBottom: "10px",
                      }}
                    />
                  ))}
                  {errors.section && <div className="text-danger">{errors.section}</div>}
                </Form.Group>

                {/* COURSE - FIXED */}
                <Form.Group className="mb-4">
                  <Form.Label className="section-label">
                    Select Course <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={selectedCourse}  // 🔥 USE selectedCourse state
                    onChange={handleCourseChange}
                    className={errors.courseId ? "is-invalid" : ""}
                  >
                    <option value="">-- Choose Course --</option>
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </Form.Select>
                  
                  {courseId && (
                    <div className="mt-2 p-2 bg-light rounded small">
                      <strong>ID:</strong> {courseId} | 
                      <strong> Name:</strong> {courseName}
                    </div>
                  )}
                  
                  {errors.courseId && (
                    <div className="text-danger">{errors.courseId}</div>
                  )}
                </Form.Group>

                {/* CATEGORY */}
                <Form.Group className="mb-5">
                  <Form.Label className="section-label">
                    Select Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={errors.category ? "is-invalid" : ""}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  {errors.category && (
                    <div className="text-danger">{errors.category}</div>
                  )}
                </Form.Group>

                {/* FIXED SUBMIT BUTTON */}
                <Button
                  type="submit"
                  className="w-100 ultimate-submit-btn btn-lg"
                  disabled={!isFormValid}  // 🔥 FIXED: Simple boolean check
                  style={{
                    opacity: isFormValid ? 1 : 0.6,
                    cursor: isFormValid ? 'pointer' : 'not-allowed'
                  }}
                >
                  {showSuccess ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Proceeding to Mark Entry...
                    </>
                  ) : isFormValid ? (
                    "🚀 Proceed to Mark Entry Dashboard"
                  ) : (
                    "⚠️ Complete all fields"
                  )}
                </Button>

                {/* 🔥 DEBUG INFO (Remove in production) */}
                <div className="mt-3 small text-muted">
                  Debug: {year ? 'Y✓' : 'Y✗'} {department ? 'D✓' : 'D✗'} 
                  {section ? 'S✓' : 'S✗'} {courseId ? 'C✓' : 'C✗'} {category ? 'Cat✓' : 'Cat✗'} 
                  = {isFormValid ? 'ENABLED' : 'DISABLED'}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MarkForm;
