// src/Pages/MarkSheet.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Spinner } from 'react-bootstrap';
import './MarkSheet.css'; // Optional styling

const MarkSheet = () => {
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const rollno = user?.rollno;

  useEffect(() => {
    if (rollno) {
      fetchStudentMarks();
    } else {
      setError('Please log in to view your marks');
      setLoading(false);
    }
  }, [rollno]);

  const fetchStudentMarks = async () => {
    try {
      setLoading(true);
      console.log('Fetching marks for rollno:', rollno);
      const response = await fetch(`http://localhost:5000/api/student-marks?rollno=${rollno}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch marks');
      }

      const data = await response.json();
      setMarksData(data);
    } catch (err) {
      setError(err.message);
      console.error('Marks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div>
          <Spinner animation="border" variant="primary" />
          <h5 className="mt-2">Loading your marks...</h5>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="min-vh-100 d-flex align-items-center">
        <Card className="w-100 mx-auto" style={{ maxWidth: '500px' }}>
          <Card.Body className="text-center">
            <Card.Title>❌ Failed to Fetch Marks</Card.Title>
            <Card.Text>{error}</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (marksData && marksData.marksList.length === 0) {
    return (
      <Container className="min-vh-100 d-flex align-items-center">
        <Card className="w-100 mx-auto" style={{ maxWidth: '500px' }}>
          <Card.Body className="text-center">
            <Card.Title>❌ No Marks Found</Card.Title>
            <Card.Text>You have no marks recorded yet.</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5 min-vh-100">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          📈 Your Mark Sheet
        </h1>
        <h3 className="text-muted">
          Roll No: <Badge bg="info" className="fs-5">{marksData.rollno}</Badge>
        </h3>
        <h5 className="text-success">
          Total Assessments: <Badge bg="success">{marksData.totalCourses}</Badge>
        </h5>
      </div>

      {/* MARKS TABLE */}
      <Card className="shadow-lg mb-4">
        <Card.Header className="bg-gradient-primary text-white">
          <h4>📊 All Your Marks</h4>
        </Card.Header>
        <Card.Body>
          <Table responsive hover className="mark-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Assessment</th>
                <th>Marks</th>
                <th>Status</th>
                <th>Teacher</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {marksData.marksList.map((mark, index) => (
                <tr key={index}>
                  <td>
                    <strong>{mark.course_name}</strong><br/>
                    <small className="text-muted">({mark.course_id})</small>
                  </td>
                  <td>{mark.category}</td>
                  <td>
                    <span className="fs-5 fw-bold text-primary">
                      {mark.marks}/{mark.total_marks}
                    </span>
                  </td>
                  <td>
                    <Badge bg={mark.status === 'Pass' ? 'success' : 'warning'}>
                      {mark.status}
                    </Badge>
                  </td>
                  <td>{mark.teacher_name}</td>
                  <td>
                    <small>{mark.last_updated}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* SUMMARY BY COURSE */}
      {Object.keys(marksData.marksByCourse).length > 0 && (
        <div className="row">
          {Object.entries(marksData.marksByCourse).map(([course, assessments]) => (
            <div key={course} className="col-md-6 col-lg-4 mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h6>{course}</h6>
                </Card.Header>
                <Card.Body>
                  {assessments.map((mark, idx) => (
                    <div key={idx} className="d-flex justify-content-between mb-2">
                      <span>{mark.category}</span>
                      <strong className={`text-${mark.status === 'Pass' ? 'success' : 'warning'}`}>
                        {mark.marks}/{mark.total_marks}
                      </strong>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default MarkSheet;
