// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import ScrollToTop from "./Components/ScrollToTop";

import Home from "./Pages/Home";
import AttendanceForm from "./Pages/AttendanceForm";
import AttendanceUpload from "./Pages/AttendanceUpload";
import AttendanceData from "./Pages/AttendanceData";

import MarkUpload from "./Pages/MarkUpload";
import MarkForm from "./Pages/MarkForm";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import MarkSheet from "./Pages/MarkSheet";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/attendance-form" element={<AttendanceForm />} />
          <Route path="/attendance-upload" element={<AttendanceUpload />} />
          <Route path="/attendance-data" element={<AttendanceData />} />

          <Route path="/mark-upload" element={<MarkUpload />} />
          <Route path="/mark-form" element={<MarkForm />} />
          <Route path="/mark-sheet" element={<MarkSheet />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
