import React from "react";

const AttendanceDashboard = () => {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const handleMarkAttendance = async () => {
  try {
    const response = await fetch("http://localhost:5000/mark_attendance", {
      method: "POST",
    });

    if (response.ok) {
      alert("Camera started! Press Q to stop.");
    } else {
      alert("Failed to start attendance");
    }
  } catch (error) {
    alert("Backend not running on port 5000");
  }
};


  const handleTrainData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch('http://localhost:5000/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}. Make sure the backend is running on port 5000.`);
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
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h2 style={{ marginBottom: 40 }}>AI Attendance Dashboard</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          style={buttonStyle("#4CAF50")}
          onClick={handleMarkAttendance}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={iconStyle}>📝</span>
          Mark Attendance
        </button>

        <button
          style={buttonStyle("#2196F3")}
          onClick={handleTrainData}
          disabled={loading}
          onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => !loading && (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={iconStyle}>{loading ? "⏳" : "🤖"}</span>
          {loading ? "Training..." : "Train Data"}
        </button>

        <button
          style={buttonStyle("#FF5722")}
          onClick={handleAddUser}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={iconStyle}>➕</span>
          Add New User
        </button>
      </div>
      {message && (
        <div style={{ marginTop: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
