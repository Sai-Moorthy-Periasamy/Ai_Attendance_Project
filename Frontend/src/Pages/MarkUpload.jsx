import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";

const MarkUploadPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Function to extract text from an image using Tesseract OCR
  const extractTextFromImage = (image) => {
    return Tesseract.recognize(image, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => text)
      .catch((err) => {
        console.error("OCR error:", err);
        return "";
      });
  };

  // Function to parse extracted text into structured data
  const parseTextToData = (text) => {
    // Assuming the text contains rows with columns: Sno rollno name mark
    // Example row: 1 12345 John 95
    const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    const data = [];
    lines.forEach((line) => {
      const parts = line.split(/\s+/);
      if (parts.length >= 4) {
        const [sno, rollno, ...rest] = parts;
        const mark = rest.pop();
        const name = rest.join(" ");
        if (!isNaN(sno) && rollno && name && !isNaN(mark)) {
          data.push({ sno, rollno, name, mark });
        }
      }
    });
    return data;
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    setLoading(true);
    let allData = [];
    for (const img of images) {
      const text = await extractTextFromImage(img);
      const data = parseTextToData(text);
      allData = allData.concat(data);
    }
    setLoading(false);
    // Navigate to MarkSheet page with extracted data
    navigate("/mark-sheet", { state: { data: allData } });
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
          disabled={loading}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "12px 0",
            backgroundColor: loading ? "#999" : "#b41414ff",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "Times New Roman, Times, serif",
          }}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default MarkUploadPage;
