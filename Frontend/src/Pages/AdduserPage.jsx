import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdduserPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    rollno: "",
    email: "",
    password: "",
    profession: "staff", // ✅ default teacher
    year: "",
    dept: "",
    section: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // if profession changes, reset student-only fields
    if (name === "profession" && value !== "student") {
      setForm({
        ...form,
        profession: value,
        year: "",
        dept: "",
        section: "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAdduser = async () => {
    try {
      const payload = {
        name: form.name,
        rollno: form.rollno,
        email: form.email,
        password: form.password,
        profession: form.profession,

        // ✅ only send these if student
        year: form.profession === "student" ? form.year : null,
        dept: form.profession === "student" ? form.dept : null,
        section: form.profession === "student" ? form.section : null,
      };

      const res = await axios.post("http://localhost:5000/adduser", payload);
      alert(res.data.message);
    } catch (err) {
      alert("Adduser failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center fw-bold text-primary mb-4">
          Create Account
        </h3>

        {/* NAME */}

        {/* PROFESSION */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Profession</label>
          <select
            name="profession"
            className="form-select"
            value={form.profession}
            onChange={handleChange}
          >
            <option value="staff">Staff (Teacher)</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* ROLL NO */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Roll No</label>
          <input
            type="text"
            name="rollno"
            className="form-control"
            value={form.rollno}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* 🔥 STUDENT ONLY FIELDS */}
        {form.profession === "student" && (
          <>
            {/* YEAR */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Year</label>
              <select
                name="year"
                className="form-select"
                value={form.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
        
            {/* DEPARTMENT */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Department</label>
              <select
                name="dept"
                className="form-select"
                value={form.dept}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AI & DS">AI & DS</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
        
            {/* SECTION */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Section</label>
              <select
                name="section"
                className="form-select"
                value={form.section}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </>
        )}


        <button
          className="btn btn-primary w-100 fw-bold mt-2"
          onClick={handleAdduser}
        >
          Add User
        </button>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <button className="btn btn-link p-0" onClick={() => navigate("/login")}>
              Login
            </button>
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdduserPage;
