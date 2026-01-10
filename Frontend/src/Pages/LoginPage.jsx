import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", profession: "student" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      alert(res.data.message);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const from = location.state?.from || '/attendance-form';
      navigate(from);
    } catch (err) {
      alert("Login failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h3 className="card-title text-center mb-4 fw-bold text-primary">Welcome Back</h3>
        {/* Added below text */}
        

        <div className="mb-4">
          <label className="form-label fw-semibold">Profession</label>
          <select
            className="form-select"
            name="profession"
            value={form.profession}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
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
            placeholder="Enter your password"
            className="form-control shadow-sm"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex flex-column gap-2">
          <button
            className="btn btn-gradient-primary w-100 fw-bold"
            onClick={handleLogin}
            style={{ background: "linear-gradient(90deg, #007bff, #00c6ff)", border: "none" }}
          >
            Login
          </button>
            </div>
      </div>
    </div>
  );
};

export default LoginPage;
