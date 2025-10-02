import React, { useState } from "react";

const departments = [
  "Computer Science and Engineering (CSE)",
  "Information Technology (IT)",
  "Artificial Intelligence and Data Science (AIDS)",
  "Mechanical Engineering (Mech)",
  "Electrical and Electronics Engineering (EEE)",
  "Electronics and Communication Engineering (ECE)",
  "Civil Engineering (Civil)",
  "Mechatronics Engineering (Mechatronics)",
  "Bio Technology (Biotech)",
];

const ClassDetailsForm = ({ onProceed }) => {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (year && department && section) {
      onProceed({ year, department, section });
    } else {
      alert("Please select all fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className=" p-3 border rounded" style={{ maxWidth: 400,boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",fontFamily: "Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif"}}>
      <br />
      <h5>Select Year</h5>
      <br />
      {["I", "II", "III", "IV"].map((y) => (
        <div key={y}>
          <input
            type="radio"
            id={y}
            value={y}
            checked={year === y}
            onChange={(e) => setYear(e.target.value)}
          />
          <label htmlFor={y} className="ms-2">{y} Year</label>
        </div>
      ))}
      <br />
      <h5 className="mt-3">Select Department</h5>
      <br />
      <select
        className="form-select"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">-- Select Department --</option>
        {departments.map((dep) => (
          <option key={dep} value={dep}>{dep}</option>
        ))}
      </select>
       <br /> 
      <h5 className="mt-3">Select Section</h5>
      <br />
      {["A", "B", "C"].map((s) => (
        <div key={s}>
          <input
            type="radio"
            id={s}
            value={s}
            checked={section === s}
            onChange={(e) => setSection(e.target.value)}
          />
          <label htmlFor={s} className="ms-2">Section {s}</label>
        </div>
      ))}
      <br />
      <button type="submit" className="btn btn-outline-success container d-flex flex-column align-items-center justify-content-center mt-3">Proceed</button>
    </form>
  );
};

export default ClassDetailsForm;
