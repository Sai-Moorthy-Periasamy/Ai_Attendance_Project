import React, { useEffect, useState, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { CloudUpload, X } from "react-bootstrap-icons";
ModuleRegistry.registerModules([AllCommunityModule]);

const AttendanceData = () => {
  const location = useLocation();
  const { year, department, section, period } = location.state || {};
  const finalYear = year || localStorage.getItem("year");
  const finalDept = department || localStorage.getItem("department");
  const finalSection = section || localStorage.getItem("section");
  const finalPeriod = period || localStorage.getItem("period");

  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [faces, setFaces] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const imgRef = useRef(null);

  if (!finalYear || !finalDept || !finalSection || !finalPeriod) {
    return (
      <div className="container mt-5 text-center">
        <h4>Please select Year, Department and Section first.</h4>
      </div>
    );
  }

  useEffect(() => {
    setLoading(true);
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Always fetch all students first
    fetch(
      `http://localhost:5000/students?year=${finalYear}&dept=${finalDept}&section=${finalSection}`
    )
      .then((res) => res.json())
      .then((studentsData) => {
        const students = studentsData.map((s) => ({
          rollno: s.rollno,
          name: s.name,
          status: "Absent",
        }));

        // Then fetch attendance data for today to update statuses
        fetch(
          `http://localhost:5000/attendance-data?year=${finalYear}&dept=${finalDept}&section=${finalSection}&period=${finalPeriod}&date=${currentDate}`
        )
          .then((res) => res.json())
          .then((attendanceData) => {
            // Update student statuses based on attendance data
            const updatedStudents = students.map((student) => {
              const attendanceRecord = attendanceData.find(
                (record) => record.rollno === student.rollno
              );
              return attendanceRecord
                ? { ...student, status: attendanceRecord.status }
                : student;
            });
            setRowData(updatedStudents);
          })
          .catch((err) => {
            console.error("Error fetching attendance data:", err);
            // If attendance fetch fails, just use students with Absent status
            setRowData(students);
          });
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setRowData([]);
      })
      .finally(() => setLoading(false));
  }, [year, department, section, finalYear, finalDept, finalSection, finalPeriod]);

  const columnDefs = useMemo(
    () => [
      { headerName: "Roll No", field: "rollno", flex: 1, sortable: true, filter: true },
      { headerName: "Student Name", field: "name", flex: 2, sortable: true, filter: true },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Present", "Absent", "Onduty"] },
        cellRenderer: (params) => (
          <span
            style={{
              color: params.value === "Present" ? "green" :
                     params.value === "Absent" ? "red" :
                     params.value === "Onduty" ? "orange" : "black",
              fontWeight: "bold",
            }}
          >
            {params.value}
          </span>
        ),
      },
    ],
    []
  );

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleImageUpload = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB!");
      return;
    }

    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setImageURL(url);
    setFaces([]);

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadProgress(50);
      const res = await fetch("http://localhost:5001/detect-faces", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      setUploadProgress(100);
      
      if (res.ok && data.faces) {
        const detectedFaces = data.faces.map((f) => ({ ...f, color: "pink", selected: false }));
        setFaces(detectedFaces);
        setSubmitEnabled(false);
      } else {
        alert("No faces detected or error occurred");
      }
    } catch (err) {
      console.error(err);
      alert("Face detection failed");
    } finally {
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleFaceClick = (index) => {
    setFaces((prev) =>
      prev.map((f, i) => 
        i === index 
          ? { ...f, color: f.color === "pink" ? "green" : "pink", selected: !f.selected }
          : f
      )
    );
    
    setSubmitEnabled(true);
  };

const handleSubmitAttendance = async () => {
  // Get staff info from localStorage
  const staffRoll = localStorage.getItem("rollno");
  const staffName = localStorage.getItem("name");

  if (!staffRoll || !staffName) {
    alert("Staff info not found! Please login again.");
    return;
  }

  // Filter selected faces (marked green)
  const selectedFaces = faces.filter(f => f.color === "green");

  if (selectedFaces.length === 0) {
    alert("No students selected! Please click on student boxes to mark Present.");
    return;
  }

  // Update table locally
  const updatedRowData = rowData.map(student => {
    const selected = selectedFaces.find(f => f.rollno === student.rollno);
    return selected ? { ...student, status: "Present" } : student;
  });
  setRowData(updatedRowData);

  // Prepare payload for backend
  const payload = selectedFaces.map(f => ({
    rollno: f.rollno,
    name: f.name,
    year: finalYear,
    dept: finalDept,
    section: finalSection,
    period: finalPeriod,
    status: "Present",
    staff_rollno: staffRoll,
    staff_name: staffName,
  }));

  try {
    const res = await fetch("http://localhost:5000/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: payload }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`✅ Attendance saved for ${selectedFaces.length} students!`);
      closeModal();
    } else {
      alert("Error saving attendance: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Server error while saving attendance");
  }
};

  const openModal = () => {
    setShowModal(true);
    setUploadedFile(null);
    setImageURL(null);
    setFaces([]);
    setDragActive(false);
    setUploadProgress(0);
    setSubmitEnabled(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadedFile(null);
    setImageURL(null);
    setFaces([]);
    setDragActive(false);
    setUploadProgress(0);
    setSubmitEnabled(false);
    if (imageURL) URL.revokeObjectURL(imageURL);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showModal, imageURL]);

  const getImageScale = () => {
    if (!imgRef.current || !faces.length) return 1;
    const imgWidth = imgRef.current.naturalWidth || imgRef.current.width;
    return imgRef.current.offsetWidth / imgWidth;
  };

  return (
    <>
      <div className="container mt-4">
        <div className="card shadow-sm mb-3">
          <div className="card-body text-center">
            <h4 className="mb-1">AI Attendance</h4>
            <p className="text-muted mb-0">
              <strong>Year:</strong> {finalYear} |{" "}
              <strong>Department:</strong> {finalDept} |{" "}
              <strong>Section:</strong> {finalSection} |{" "}
              <strong>Period:</strong> {finalPeriod}
            </p>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <p className="mt-2">Loading students...</p>
              </div>
            ) : (
              <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  pagination
                  paginationPageSize={10}
                  domLayout="autoHeight"
                />
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-success btn-lg px-5" onClick={openModal}>
            📷 Mark Attendance
          </button>
        </div>
      </div>
<br />
      {/* MODAL */}
      {showModal && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              background: 'white', borderRadius: '20px', maxWidth: '650px',
              maxHeight: '90vh', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              overflow: 'hidden', position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '24px 32px 16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', position: 'relative'
            }}>
              <button onClick={closeModal} style={{
                position: 'absolute', top: '16px', right: '20px',
                background: 'none', border: 'none', color: 'white',
                fontSize: '24px', cursor: 'pointer', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%'
              }}>
                <X size={24} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)',
                  borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CloudUpload size={28} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>AI Face Recognition</h4>
                  <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
                    Click pink boxes to mark students Present
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: '32px', maxHeight: '500px', overflowY: 'auto' }}>
              {!imageURL && (
                <div style={{
                  border: dragActive ? '3px dashed #667eea' : '2px dashed #dee2e6',
                  borderRadius: '16px', padding: '40px 24px', textAlign: 'center',
                  cursor: 'pointer', backgroundColor: dragActive ? '#f8f9ff' : '#f8f9fa',
                  minHeight: '200px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center'
                }}
                onDragEnter={handleDrag} onDragLeave={handleDrag}
                onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <div style={{
                    width: '72px', height: '72px', background: dragActive ? '#667eea' : '#e9ecef',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: '16px'
                  }}>
                    <CloudUpload size={32} style={{ color: dragActive ? 'white' : '#6c757d' }} />
                  </div>
                  <h5 style={{ color: dragActive ? '#667eea' : '#495057', margin: '0 0 8px 0' }}>
                    {dragActive ? 'Drop image here' : 'Drag & drop classroom photo'}
                  </h5>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>PNG, JPG • Max 5MB</p>
                  <input id="fileInput" type="file" className="d-none" accept="image/*" onChange={handleFileChange} />
                </div>
              )}

              {imageURL && (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
                  <img 
                    ref={imgRef}
                    src={imageURL} 
                    alt="Classroom" 
                    style={{ 
                      maxWidth: '100%', maxHeight: '400px', borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                  />
                  {faces.map((face, idx) => {
                    const { top, right, bottom, left } = face.box;
                    const scale = getImageScale();
                    return (
                      <div
                        key={idx}
                        onClick={() => handleFaceClick(idx)}
                        style={{
                          position: 'absolute',
                          top: `${top * scale}px`,
                          left: `${left * scale}px`,
                          width: `${(right - left) * scale}px`,
                          height: `${(bottom - top) * scale}px`,
                          border: `4px solid ${face.color}`,
                          backgroundColor: `${face.color === 'green' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 105, 180, 0.3)'}`,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'flex-end',
                          padding: '4px',
                        }}
                        title={`Click to ${face.color === 'green' ? 'unselect' : 'mark Present'}: ${face.name} (${face.rollno})`}
                      >
                        <div style={{
                          background: face.color === 'green' ? '#28a745' : '#ff69b4',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {face.rollno}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {uploadProgress > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: '#28a745', borderRadius: '4px',
                      width: `${uploadProgress}%`, transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {faces.length > 0 && (
                <div style={{ marginTop: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
                  <h6 style={{ margin: '0 0 12px 0', color: '#495057' }}>
                    📊 {faces.filter(f => f.color === 'green').length}/{faces.length} students marked
                  </h6>
                </div>
              )}
            </div>

            <div style={{
              padding: '24px 32px', borderTop: '1px solid #e9ecef',
              display: 'flex', gap: '12px', justifyContent: 'flex-end'
            }}>
              <button onClick={closeModal} style={{
                padding: '12px 24px', border: '1px solid #dee2e6', background: 'white',
                borderRadius: '10px', fontWeight: '500', cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button 
                onClick={handleSubmitAttendance}
                disabled={!submitEnabled}
                style={{
                  padding: '12px 24px',
                  background: submitEnabled ? 
                    'linear-gradient(135deg, #28a745, #20c997)' : '#6c757d',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontWeight: '500', cursor: submitEnabled ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                ✅ Submit Attendance ({faces.filter(f => f.color === 'green').length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceData;
