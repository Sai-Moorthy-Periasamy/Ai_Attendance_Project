import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AttendanceUpload = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { year, department, section } = location.state || {};
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("");

  // Safety check - Professional error page
  if (!year || !department || !section) {
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
            <div style={{
              fontSize: '36px'
            }}>⚠️</div>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 16px', color: '#333' }}>
            Selection Required
          </h2>
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6', margin: 0 }}>
            Please select <strong>Year</strong>, <strong>Department</strong>, and <strong>Section</strong> 
            to continue with attendance management.
          </p>
        </div>
      </div>
    );
  }

  const handleMarkAttendance = () => {
    navigate("/attendance-data", { state: { year, department, section } });
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
    alert("Add New User feature coming soon! 🚀");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f093fb 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* HERO HEADER */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '48px',
          marginBottom: '48px',
          boxShadow: '0 35px 80px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #ff6b9d, #c44569)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 12px 0',
                lineHeight: '1.1'
              }}>
                AI Attendance Dashboard
              </h1>
              <p style={{
                fontSize: '20px',
                color: '#666',
                margin: 0,
                fontWeight: '400'
              }}>
                Intelligent face recognition system for modern classrooms
              </p>
            </div>
            
          </div>

          {/* CLASS DETAILS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginTop: '32px'
          }}>
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '14px', color: '#667eea', fontWeight: '600', marginBottom: '8px' }}>
                📚 YEAR
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a' }}>
                {year}
              </div>
            </div>
            <div style={{
              background: 'rgba(40, 167, 69, 0.1)',
              border: '2px solid rgba(40, 167, 69, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '14px', color: '#28a745', fontWeight: '600', marginBottom: '8px' }}>
                🏢 DEPARTMENT
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
                {department}
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 193, 7, 0.1)',
              border: '2px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '20px',
              padding: '28px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '14px', color: '#ffc107', fontWeight: '600', marginBottom: '8px' }}>
                📋 SECTION
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#1a1a1a' }}>
                {section}
              </div>
            </div>
          </div>
        </div>

        {/* ACTION CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          
          {/* MARK ATTENDANCE */}
          <div 
            style={{
              background: 'linear-gradient(145deg, #4CAF50 0%, #45a049 100%)',
              borderRadius: '32px',
              padding: '48px 32px',
              color: 'white',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(76, 175, 80, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onClick={handleMarkAttendance}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 40px 80px rgba(76, 175, 80, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(76, 175, 80, 0.4)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              backdropFilter: 'blur(20px)'
            }} />
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              📷
            </div>
            <h3 style={{
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 16px 0',
              lineHeight: '1.2'
            }}>
              Mark Attendance
            </h3>
            <p style={{
              fontSize: '18px',
              margin: 0,
              opacity: 0.95,
              lineHeight: '1.5'
            }}>
              Capture classroom photo with AI face detection
            </p>
          </div>

          {/* TRAIN AI */}
          <div 
            style={{
              background: 'linear-gradient(145deg, #2196F3 0%, #1976D2 100%)',
              borderRadius: '32px',
              padding: '48px 32px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(33, 150, 243, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            onClick={!loading ? handleTrainData : undefined}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 40px 80px rgba(33, 150, 243, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(33, 150, 243, 0.4)';
              }
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              backdropFilter: 'blur(20px)'
            }} />
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              filter: loading ? 'grayscale(1)' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              {loading ? '⏳' : '🤖'}
            </div>
            <h3 style={{
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 16px 0',
              lineHeight: '1.2'
            }}>
              {loading ? 'Training AI...' : 'Train AI Model'}
            </h3>
            <p style={{
              fontSize: '18px',
              margin: 0,
              opacity: 0.95,
              lineHeight: '1.5'
            }}>
              {loading ? 'Improving recognition accuracy...' : 'Optimize model with latest data'}
            </p>
          </div>

          {/* ADD USER */}
          <div 
            style={{
              background: 'linear-gradient(145deg, #FF5722 0%, #D84315 100%)',
              borderRadius: '32px',
              padding: '48px 32px',
              color: 'white',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(255, 87, 34, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onClick={handleAddUser}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 40px 80px rgba(255, 87, 34, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(255, 87, 34, 0.4)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              backdropFilter: 'blur(20px)'
            }} />
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              ➕
            </div>
            <h3 style={{
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 16px 0',
              lineHeight: '1.2'
            }}>
              Add New Student
            </h3>
            <p style={{
              fontSize: '18px',
              margin: 0,
              opacity: 0.95,
              lineHeight: '1.5'
            }}>
              Register new students for face recognition
            </p>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div style={{
            marginTop: '48px',
            padding: '32px 40px',
            background: messageType === 'success' ? 
              'linear-gradient(135deg, #d4edda, #c3e6cb)' : 
              'linear-gradient(135deg, #f8d7da, #f5c6cb)',
            borderRadius: '24px',
            borderLeft: messageType === 'success' ? '6px solid #28a745' : '6px solid #dc3545',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{
              fontSize: messageType === 'success' ? '48px' : '44px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              {messageType === 'success' ? '✅' : '❌'}
            </div>
            <div style={{ fontSize: '18px', lineHeight: '1.6' }}>
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceUpload;
