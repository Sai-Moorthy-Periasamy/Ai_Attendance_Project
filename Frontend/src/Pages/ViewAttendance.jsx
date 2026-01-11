import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";

const ViewAttendance = () => {
  const [year, setYear] = useState("");
  const [dept, setDept] = useState("");
  const [section, setSection] = useState("");
  const [period, setPeriod] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const departments = [
    "CSE", "IT", "AI & DS", "MECH", "EEE", "ECE", "Civil",
    "Mechatronics", "Biotech"
  ];

  // Load saved class info from localStorage
  useEffect(() => {
    const classDetails = JSON.parse(localStorage.getItem("classDetails")) || {};
    setYear(classDetails.year || "");
    setDept(classDetails.department || "");
    setSection(classDetails.section || "");
    setPeriod(classDetails.period || "");
  }, []);

  // Fetch students and merge attendance
  const fetchAttendance = useCallback(async () => {
    if (!year || !dept || !section || !period || !date) {
      setToastMessage("Please fill all fields");
      setToastVariant("warning");
      return;
    }

    setLoading(true);
    setToastMessage("");

    try {
      // 1️⃣ Fetch all students for selected class
      const studentRes = await fetch(
        `http://localhost:5000/students?year=${year}&dept=${dept}&section=${section}`
      );
      const studentData = await studentRes.json();
      const studentsList = studentData.map(s => ({
        rollno: s.rollno,
        name: s.name,
        status: "Absent", // default
      }));

      // 2️⃣ Fetch attendance for the selected date and period
      const attendanceRes = await fetch(
        `http://localhost:5000/attendance-data?year=${year}&dept=${dept}&section=${section}&period=${period}&date=${date}`
      );
      const attendanceData = await attendanceRes.json();

      // 3️⃣ Merge attendance status into students
      const mergedStudents = studentsList.map(student => {
        const record = attendanceData.find(a => a.rollno === student.rollno);
        return record ? { ...student, status: record.status } : student;
      });

      setStudents(mergedStudents);
      setToastMessage(`Loaded ${mergedStudents.length} students`);
      setToastVariant("info");
    } catch (err) {
      console.error(err);
      setToastMessage("Error fetching attendance: " + err.message);
      setToastVariant("danger");
    } finally {
      setLoading(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  }, [year, dept, section, period, date]);

  // Save attendance
  const handleSubmit = async () => {
    if (students.length === 0) {
      setToastMessage("No students loaded. Please search first.");
      setToastVariant("warning");
      return;
    }

    const staffRoll = localStorage.getItem("rollno");
    const staffName = localStorage.getItem("name");
    if (!staffRoll || !staffName) {
      setToastMessage("Staff info not found! Please login again.");
      setToastVariant("danger");
      return;
    }

    setSaving(true);

    try {
      const records = students.map(s => ({
        rollno: s.rollno,
        name: s.name,
        year,
        dept,
        section,
        period,
        status: s.status,
        staff_rollno: staffRoll,
        staff_name: staffName,
        date,
      }));

      const res = await fetch("http://localhost:5000/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMessage("Attendance saved successfully! ✅");
        setToastVariant("success");
      } else {
        setToastMessage("Error: " + data.error);
        setToastVariant("danger");
      }

      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setToastMessage("Error submitting attendance: " + err.message);
      setToastVariant("danger");
      setTimeout(() => setToastMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const columnDefs = [
    { headerName: "Roll No", field: "rollno", pinned: "left", width: 120 },
    { headerName: "Name", field: "name", flex: 2 },
    {
      headerName: "Status",
      field: "status",
      width: 150,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Present", "Absent", "Onduty"] },
      cellRenderer: (params) => (
        <span style={{
          color:
            params.value === "Present" ? "green" :
            params.value === "Absent" ? "red" :
            params.value === "Onduty" ? "orange" : "black",
          fontWeight: "bold"
        }}>
          {params.value}
        </span>
      )
    }
  ];

  return (
    <div className="view-attendance-wrapper">
      <Container fluid className="py-5">
        <Row>
          <Col xl={12}>
            <div className="text-center mb-5">
              <h2>📋 Attendance Management</h2>
              <p>View, edit, and submit attendance for selected class</p>
            </div>

            {/* FILTERS */}
            <Card className="mb-5 shadow-lg border-0">
              <Card.Body className="p-4">
                <Row className="align-items-end g-3">
                  <Col md={2}>
                    <Form.Label>📚 Year</Form.Label>
                    <Form.Select value={year} onChange={e => setYear(e.target.value)}>
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>🏛️ Department</Form.Label>
                    <Form.Select value={dept} onChange={e => setDept(e.target.value)}>
                      <option value="">Select Department</option>
                      {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>📋 Section</Form.Label>
                    <Form.Select value={section} onChange={e => setSection(e.target.value)}>
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>⏰ Period</Form.Label>
                    <Form.Select value={period} onChange={e => setPeriod(e.target.value)}>
                      <option value="">Select Period</option>
                      {[1,2,3,4,5,6,7,8].map(p => <option key={p} value={p}>Period {p}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label>📅 Date</Form.Label>
                    <Form.Control type="date" value={date} onChange={e => setDate(e.target.value)} />
                  </Col>
                  <Col md={2}>
                    <Button onClick={fetchAttendance} disabled={loading} className="w-100">
                      {loading ? <Spinner animation="border" size="sm" /> : "🔍 Search"}
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* TOAST */}
            {toastMessage && (
              <Alert variant={toastVariant} className="position-fixed top-20 end-20 p-3 shadow" style={{ zIndex: 9999, minWidth: "250px" }}>
                {toastMessage}
              </Alert>
            )}

            {/* AG GRID */}
            {students.length > 0 && (
              <Card className="shadow-lg border-0">
                <Card.Body className="p-0">
                  <div className="ag-theme-alpine" style={{ height: "70vh", width: "100%" }}>
                    <AgGridReact
                      rowData={students}
                      columnDefs={columnDefs}
                      defaultColDef={{ flex: 1, minWidth: 140, resizable: true, sortable: true, filter: true }}
                      stopEditingWhenCellsLoseFocus={true}
                      animateRows={true}
                      pagination={true}
                      paginationPageSize={15}
                    />
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* SUBMIT BUTTON */}
            {students.length > 0 && (
              <div className="text-center mt-4">
                <Button onClick={handleSubmit} disabled={saving || loading} size="lg">
                  {saving ? <Spinner animation="border" size="sm" /> : "🚀 Submit Attendance"}
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ViewAttendance;
