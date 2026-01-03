import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AttendanceData = () => {
  const location = useLocation();
  const { year, department, section } = location.state || {};

  const [students, setStudents] = useState([]);
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch students from backend based on selected class
  useEffect(() => {
    if (!year || !department || !section) return;

    fetch(
      `http://localhost:5000/students?year=${year}&dept=${department}&section=${section}`
    )
      .then((res) => res.json())
      .then((data) => {
        const studentsWithStatus = data.map((s) => ({ ...s, status: "Absent" }));
        setStudents(studentsWithStatus);
      })
      .catch((err) => console.error(err));
  }, [year, department, section]);

  // Poll attendance status from backend every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5001/attendance-status")
        .then((res) => res.json())
        .then((presentRollNos) => {
          setStudents((prev) =>
            prev.map((s) => ({
              ...s,
              status: presentRollNos.includes(s.rollno) ? "Present" : "Absent",
            }))
          );
        })
        .catch((err) => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Start camera to mark attendance
  const handleMarkAttendance = async () => {
    setLoadingCamera(true);
    setMessage("");
    try {
      const response = await fetch("http://localhost:5001/mark_attendance", {
        method: "POST",
      });

      if (response.ok) {
        setMessage("Camera started! Press Q to stop.");
      } else {
        const data = await response.json();
        setMessage("Failed to start camera: " + data.error);
      }
    } catch (error) {
      setMessage(
        "Backend not running on port 5001 or CORS issue. " + error.message
      );
    } finally {
      setLoadingCamera(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">
        Year: {year} | Dept: {department} | Section: {section}
      </h4>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.rollno}>
              <td>{s.rollno}</td>
              <td>{s.name}</td>
              <td
                style={{
                  color: s.status === "Present" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {s.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex flex-column align-items-center mt-3">
        <button
          className="btn btn-success"
          onClick={handleMarkAttendance}
          disabled={loadingCamera}
        >
          {loadingCamera ? "Starting Camera..." : "Mark Attendance"}
        </button>
        {message && <p className="mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default AttendanceData;
