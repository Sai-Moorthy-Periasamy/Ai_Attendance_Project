import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from "react-bootstrap";

const StudentViewAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get student info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const rollno = user?.rollno;
  const name = user?.name;
  const year = user?.year;
  const dept = user?.dept;
  const section = user?.section;

  const fetchAttendance = async () => {
    if (!date) {
      setMessage("Please select a date.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/attendance-data-student?rollno=${rollno}&date=${date}`);
      const data = await res.json();

      // Prepare 8 periods
      const periods = Array.from({ length: 8 }, (_, i) => {
        const record = data.find(d => Number(d.period) === i + 1);
        return {
          period: `Period ${i + 1}`,
          status: record ? record.status : "Not Taken",
        };
      });

      setAttendance(periods);
      setMessage(`Attendance for ${date} loaded successfully ✅`);
    } catch (err) {
      setMessage("Error fetching attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={4}>
          <Form.Label>Select Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button onClick={fetchAttendance} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "View Attendance"}
          </Button>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes("successfully") ? "success" : "info"}>
          {message}
        </Alert>
      )}

      {attendance.length > 0 && (
        <Card className="p-4 shadow">
          <h4>{name} - Attendance on {date}</h4>
          <div className="d-flex mt-3 justify-content-between">
            {attendance.map((item) => (
              <div
                key={item.period}
                style={{
                  flex: 1,
                  margin: "0 4px",
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                  backgroundColor:
                    item.status === "Present"
                      ? "#d4edda"
                      : item.status === "Absent"
                      ? "#f8d7da"
                      : item.status === "Onduty"
                      ? "#fff3cd"
                      : "#e2e3e5",
                  color:
                    item.status === "Present"
                      ? "#155724"
                      : item.status === "Absent"
                      ? "#721c24"
                      : item.status === "Onduty"
                      ? "#856404"
                      : "#6c757d",
                  fontWeight: "600",
                }}
              >
                <div>{item.period}</div>
                <div style={{ marginTop: "8px", fontSize: "18px" }}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Container>
  );
};

export default StudentViewAttendance;
