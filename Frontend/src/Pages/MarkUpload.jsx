import React, { useState } from "react";

const MarkUploadPage = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = () => {
    // Placeholder → later AI processing
    alert(`${images.length} image(s) submitted!`);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      
       <h2
    style={{
      marginBottom: 20,
      fontFamily: "Gill Sans, Gill Sans MT, Calibri, Trebuchet MS, sans-serif",
      textAlign: "center",
    }}
  >
    Upload Mark Images
  </h2>

      <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          {images.map((img, index) => (
            <img
              key={index}
              src={URL.createObjectURL(img)}
              alt={`upload-${index}`}
              style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #ccc" }}
            />
          ))}

          <label htmlFor="add-image" style={{ cursor: "pointer", border: "1px solid grey", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
            <input
              id="add-image"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <span style={{ fontSize: 48, color: "#2795f6", userSelect: "none" }}>+</span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "12px 0",
            backgroundColor: "#b41414ff",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "Times New Roman, Times, serif",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MarkUploadPage;
