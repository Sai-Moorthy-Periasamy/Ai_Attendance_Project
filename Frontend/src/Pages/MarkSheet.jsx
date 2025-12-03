import React from "react";
import { useLocation } from "react-router-dom";

const MarkSheet = () => {
  const location = useLocation();
  const data = location.state?.data || [];

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Mark Sheet</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Sno</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Roll No</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Mark</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.sno}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.rollno}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.name}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{row.mark}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: 8 }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MarkSheet;
