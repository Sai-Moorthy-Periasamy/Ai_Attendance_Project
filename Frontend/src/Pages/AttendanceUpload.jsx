import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AttendanceUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { year, department, section, period } = location.state || {};

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("");

  // 🔥 STORE TO LOCAL STORAGE
  React.useEffect(() => {
    if (year && department && section && period) {
      const classDetails = { year, department, section, period };
      localStorage.setItem("classDetails", JSON.stringify(classDetails));
    }
  }, [year, department, section, period]);

  // ❌ SAFETY CHECK
  if (!year || !department || !section || !period) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '60px 40px',
          boxShadow: '0 35px 80px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,107,157,0.2)',
            borderRadius: '50%',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '36px' }}>⚠️</div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
            Selection Required
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Please select <strong>Year</strong>, <strong>Department</strong>, 
            <strong> Section</strong> and <strong>Period</strong>.
          </p>
        </div>
      </div>
    );
  }

  const handleMarkAttendance = () => {
    navigate("/attendance-data", {
      state: { year, department, section, period }
    });
  };

  const handleTrainData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://localhost:5001/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
      } else {
        setMessage(`Error: ${data.error}`);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Backend not running on port 5001. Please start Flask server.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    alert("Add New Student – Coming Soon 🚀");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f093fb 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '48px',
          marginBottom: '48px',
          boxShadow: '0 35px 80px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Attendance Dashboard
          </h1>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Smart classroom attendance system
          </p>

          {/* CLASS INFO */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            marginTop: '32px'
          }}>
            {[
              { label: "YEAR", value: year, emoji: "📚", color: "#667eea" },
              { label: "DEPARTMENT", value: department, emoji: "🏢", color: "#28a745" },
              { label: "SECTION", value: section, emoji: "📋", color: "#ffc107" },
              { label: "PERIOD", value: `Period ${period}`, emoji: "⏰", color: "#ff5722" }
            ].map((item, idx) => (
              <div key={idx} style={{
                background: `${item.color}20`,
                border: `2px solid ${item.color}60`,
                borderRadius: '20px',
                padding: '26px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: item.color }}>
                  {item.emoji} {item.label}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {/* MARK ATTENDANCE */}
          <div
            onClick={handleMarkAttendance}
            style={{
              background: 'linear-gradient(145deg, #4CAF50, #2e7d32)',
              borderRadius: '32px',
              padding: '48px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 25px 50px rgba(76,175,80,0.5)'
            }}
          >
            <div style={{ fontSize: '60px' }}>📷</div>
            <h3 style={{ fontSize: '30px', fontWeight: '800' }}>
              Mark Attendance
            </h3>
            <p>Capture image and auto-detect faces</p>
          </div>

          {/* TRAIN */}
          <div
            onClick={!loading ? handleTrainData : undefined}
            style={{
              background: 'linear-gradient(145deg, #2196F3, #1565c0)',
              borderRadius: '32px',
              padding: '48px',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 25px 50px rgba(33,150,243,0.5)'
            }}
          >
            <div style={{ fontSize: '60px' }}>{loading ? "⏳" : "🤖"}</div>
            <h3 style={{ fontSize: '30px', fontWeight: '800' }}>
              {loading ? "Training..." : "Train AI"}
            </h3>
            <p>Improve recognition accuracy</p>
          </div>

          {/* ADD STUDENT */}
          <div
            onClick={handleAddUser}
            style={{
              background: 'linear-gradient(145deg, #ff5722, #bf360c)',
              borderRadius: '32px',
              padding: '48px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 25px 50px rgba(255,87,34,0.5)'
            }}
          >
            <div style={{ fontSize: '60px' }}>➕</div>
            <h3 style={{ fontSize: '30px', fontWeight: '800' }}>
              Add Student
            </h3>
            <p>Register new faces</p>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div style={{
            marginTop: '40px',
            padding: '28px',
            borderRadius: '24px',
            background: messageType === "success" ? "#d4edda" : "#f8d7da",
            borderLeft: `6px solid ${messageType === "success" ? "#28a745" : "#dc3545"}`,
            fontSize: '18px'
          }}>
            {messageType === "success" ? "✅" : "❌"} {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceUpload;
