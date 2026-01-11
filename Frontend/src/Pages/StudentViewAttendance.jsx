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

  const fetchAttendance = async () => {
  if (!date) {
    setMessage("Please select a date.");
    return;
  }

  setLoading(true);
  setMessage("");
  try {
    // NEW ENDPOINT with class context
    const res = await fetch(`http://localhost:5000/student-attendance-full?rollno=${rollno}&date=${date}`);
    const rawData = await res.json();
    console.log("Class-aware API data:", rawData);

    const periods = Array.from({ length: 8 }, (_, i) => {
      const periodNum = (i + 1).toString();
      const record = rawData.find(d => d.period === periodNum);
      
      if (record) {
        // Period was taken - show actual status or Absent
        return {
          period: `Period ${i + 1}`,
          status: record.status  // Present/Absent/Onduty
        };
      } else {
        // Period not taken by class
        return {
          period: `Period ${i + 1}`,
          status: "Not Taken"
        };
      }
    });

    console.log("Final display data:", periods);
    setAttendance(periods);
    setMessage(`Attendance loaded for ${date} ✅ (${rawData.length} periods taken by class)`);
  } catch (err) {
    console.error("Fetch error:", err);
    setMessage("Error: " + err.message);
  } finally {
    setLoading(false);
  }
};


  // Auto-fetch on mount for today
  useEffect(() => {
    fetchAttendance();
  }, []);

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
            {loading ? <Spinner animation="border" size="sm" /> : "🔄 Refresh"}
          </Button>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes("successfully") ? "success" : "danger"}>
          {message}
        </Alert>
      )}

      {attendance.length > 0 && (
        <Card className="p-4 shadow">
          <h4>{name} - Attendance on {date}</h4>
          <div className="d-flex mt-3 justify-content-between flex-wrap gap-2">
            {attendance.map((item, index) => (
              <div
                key={`${item.period}-${index}`} // Fixed key
                style={{
                  flex: "1 1 100px",
                  margin: "4px",
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                  backgroundColor:
                    item.status === "Present" ? "#d4edda" :
                    item.status === "Absent" ? "#f8d7da" :
                    item.status === "Onduty" ? "#fff3cd" : "#e2e3e5",
                  color:
                    item.status === "Present" ? "#155724" :
                    item.status === "Absent" ? "#721c24" :
                    item.status === "Onduty" ? "#856404" : "#6c757d",
                  fontWeight: "600",
                  minWidth: "100px",
                }}
              >
                <div style={{ fontSize: "14px" }}>{item.period}</div>
                <div style={{ marginTop: "8px", fontSize: "18px", fontWeight: "bold" }}>
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
