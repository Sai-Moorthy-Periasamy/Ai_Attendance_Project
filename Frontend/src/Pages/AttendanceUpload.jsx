import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AttendanceDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Data coming from AttendanceForm → ClassDetailsForm
  const { year, department, section } = location.state || {};

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // Safety check
  if (!year || !department || !section) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Please select Year, Department and Section first.</h3>
      </div>
    );
  }

  // Navigate to AttendanceData page
  const handleMarkAttendance = () => {
    navigate("/attendance-data", {
      state: { year, department, section },
    });
  };

  // Train AI data
  const handleTrainData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5001/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(
        "Backend not running on port 5000. Please start Flask server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    alert("Add New User clicked!");
  };

  const buttonStyle = (bgColor) => ({
    flex: 1,
    padding: "40px 20px",
    margin: "10px",
    border: "none",
    borderRadius: 12,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    backgroundColor: bgColor,
    transition: "transform 0.2s",
  });

  const iconStyle = {
    fontSize: 36,
    marginBottom: 10,
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: 10 }}>AI Attendance Dashboard</h2>

      {/* Selected class details */}
      <p style={{ marginBottom: 30, color: "#555" }}>
        <strong>Year:</strong> {year} |{" "}
        <strong>Department:</strong> {department} |{" "}
        <strong>Section:</strong> {section}
      </p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          style={buttonStyle("#4CAF50")}
          onClick={handleMarkAttendance}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <span style={iconStyle}>📝</span>
          Mark Attendance
        </button>

        <button
          style={buttonStyle("#2196F3")}
          onClick={handleTrainData}
          disabled={loading}
          onMouseOver={(e) =>
            !loading && (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseOut={(e) =>
            !loading && (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <span style={iconStyle}>{loading ? "⏳" : "🤖"}</span>
          {loading ? "Training..." : "Train Data"}
        </button>

        <button
          style={buttonStyle("#FF5722")}
          onClick={handleAddUser}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <span style={iconStyle}>➕</span>
          Add New User
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#f0f0f0",
            borderRadius: 5,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
