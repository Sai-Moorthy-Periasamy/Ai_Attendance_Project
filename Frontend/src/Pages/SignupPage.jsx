import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    rollno: "",
    email: "",
    password: "",
    profession: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/signup", form);
      alert(res.data.message);
    } catch (err) {
      alert("Signup failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h3 className="card-title text-center mb-4 fw-bold text-primary">
          Create Your Account
        </h3>

        <div className="mb-4">
          <label className="form-label fw-semibold">Profession</label>
          <select
            name="profession"
            className="form-select"
            value={form.profession}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Roll Number</label>
          <input
            type="text"
            name="rollno"
            placeholder="Enter your roll number"
            className="form-control shadow-sm"
            value={form.rollno}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            className="form-control shadow-sm"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Choose a strong password"
            className="form-control shadow-sm"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn btn-gradient-primary w-100 fw-bold"
          onClick={handleSignup}
          style={{
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
            border: "none",
          }}
        >
          Sign Up
        </button>
        {/* Added below text */}
        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <button
              className="btn btn-link p-0"
              onClick={() => navigate("/login")}
              style={{ fontSize: "0.9rem" }}
            >
              Login
            </button>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
