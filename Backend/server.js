import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE CONNECTION ================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Saimoorthy2004@gmail",
  database: "kcet",
});

db.connect((err) => {
  if (err) {
    console.error("DB Connection Failed ❌", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

/* ================= ADD USER ================= */
app.post("/adduser", async (req, res) => {
  const { rollno, email, password, profession, name, year, dept, section } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users 
      (rollno, email, password, profession, name, year, dept, section) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [rollno, email, hashedPassword, profession, name, year, dept, section],
      (err) => {
        if (err) {
         if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "User already exists" });
          }
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Adduser success ✅" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL USERS ================= */
app.get("/getusers", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id ASC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/* ================= UPDATE USER (NO PASSWORD CHANGE) ================= */
app.put("/updateuser/:id", (req, res) => {
  const { id } = req.params;
  const { name, rollno, email, profession, year, dept, section } = req.body;

  const sql = `
    UPDATE users
    SET name = ?, rollno = ?, email = ?, profession = ?, year = ?, dept = ?, section = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      rollno,
      email,
      profession,
      profession === "student" ? year : null,
      profession === "student" ? dept : null,
      profession === "student" ? section : null,
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated successfully ✅" });
    }
  );
});

/* ================= DELETE USER ================= */
app.delete("/deleteuser/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully ✅" });
  });
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { email, password, profession } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND profession = ?";
  db.query(sql, [email, profession], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(401).json({ error: "Invalid credentials ❌" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ error: "Invalid credentials ❌" });

    // SECURITY FIX: Remove password BEFORE sending response
    delete user.password;

    res.json({
      message: "Login success ✅",
      user,
    });
  });
});

/* ================= GET STUDENTS ================= */
app.get("/students", (req, res) => {
  const { year, dept, section } = req.query;

  const sql = `
    SELECT rollno, name
    FROM users
    WHERE year = ? AND dept = ? AND section = ? AND profession = 'student'
  `;

  db.query(sql, [year, dept, section], (err, results) => {
    if (err) return res.status(500).json(err);

    const students = results.map((s) => ({
      rollno: s.rollno,
      name: s.name,
      status: "Absent",
    }));

    res.json(students);
  });
});

/* ================= GET ATTENDANCE FOR CLASS ================= */
app.get("/attendance-data", (req, res) => {
  const { year, dept, section, period, date } = req.query;

  const sql = `
    SELECT rollno, name, status
    FROM attendance
    WHERE year = ? AND dept = ? AND section = ? AND period = ? AND date = ?
  `;

  db.query(sql, [year, dept, section, period, date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

// SAVE ATTENDANCE with upsert (duplicate handled)
app.post("/attendance", (req, res) => {
  const { records } = req.body;
  if (!records || !records.length) return res.status(400).json({ error: "No records provided" });

  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Prepare values for bulk insert
  const values = records.map(r => [
    r.rollno, r.name, r.year, r.dept, r.section,
    r.period, r.status, r.staff_rollno, r.staff_name, r.date || currentDate
  ]);

  const sql = `
    INSERT INTO attendance
    (rollno, name, year, dept, section, period, status, staff_rollno, staff_name, date)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      year = VALUES(year),
      dept = VALUES(dept),
      section = VALUES(section),
      status = VALUES(status),
      staff_rollno = VALUES(staff_rollno),
      staff_name = VALUES(staff_name)
  `;

  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Attendance saved successfully ✅", inserted: result.affectedRows });
  });
});

// GET STUDENT ATTENDANCE FOR DATE (OLD ENDPOINT - Keep for compatibility)
app.get("/attendance-data-student", (req, res) => {
  const { rollno, date } = req.query;

  const sql = `
    SELECT period, status
    FROM attendance
    WHERE rollno = ? AND date = ?
    ORDER BY period ASC
  `;

  db.query(sql, [rollno, date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

/* ================= NEW ENDPOINT: STUDENT ATTENDANCE WITH CLASS CONTEXT ================= */
app.get("/student-attendance-full", (req, res) => {
  const { rollno, date } = req.query;
  
  // Step 1: Get student class details
  db.query(
    "SELECT year, dept, section FROM users WHERE rollno = ? AND profession = 'student'",
    [rollno],
    (err, studentResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (studentResults.length === 0) {
        return res.status(404).json({ error: "Student not found" });
      }
      
      const { year, dept, section } = studentResults[0];
      
      // Step 2: Find ALL periods taken for this class on this date
      db.query(
        `SELECT DISTINCT period FROM attendance 
         WHERE year = ? AND dept = ? AND section = ? AND date = ?
         ORDER BY CAST(period AS UNSIGNED)`,
        [year, dept, section, date],
        (err, classPeriods) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // If no periods taken that day, return all "Not Taken"
          if (classPeriods.length === 0) {
            const periods = Array.from({ length: 8 }, (_, i) => ({
              period: (i + 1).toString(),
              status: "Not Taken"
            }));
            return res.json(periods);
          }
          
          const periods = classPeriods.map(p => p.period);
          
          // Step 3: Get student's records for those periods
          db.query(
            `SELECT period, status FROM attendance 
             WHERE rollno = ? AND date = ? AND period IN (${periods.map(() => '?').join(',')})
             ORDER BY CAST(period AS UNSIGNED)`,
            [rollno, date, ...periods],
            (err, studentRecords) => {
              if (err) return res.status(500).json({ error: err.message });
              
              // Step 4: Complete view - registered periods get status, others Absent
              const result = periods.map(period => {
                const studentRecord = studentRecords.find(r => r.period === period);
                return {
                  period: period,
                  status: studentRecord ? studentRecord.status : "Absent"
                };
              });
              
              res.json(result);
            }
          );
        }
      );
    }
  );
});
/* ================= MARK AUTOMATION ENDPOINTS ================= */
app.post('/api/students/get-by-class', (req, res) => {
  console.log('📥 GET STUDENTS:', req.body); // DEBUG
  
  const { year, department, section } = req.body;
  
  if (!year || !department || !section) {
    return res.status(400).json({ error: 'Missing year, department, or section' });
  }
  
  const sql = `
    SELECT rollno, name, year, dept, section
    FROM users 
    WHERE year = ? AND dept = ? AND section = ? AND profession = 'student'
    ORDER BY rollno ASC
  `;
  
  db.query(sql, [year, department, section], (err, results) => {
    if (err) {
      console.error('❌ DB Error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    
    console.log(`✅ Found ${results.length} students`); // DEBUG
    
    const students = results.map(s => ({
      rollNo: s.rollno,
      name: s.name,
      marks: 0
    }));
    
    res.json(students); // ✅ ALWAYS SEND JSON
  });
});

app.get('/api/student/marks', (req, res) => {
  const { rollno } = req.query;

  if (!rollno) {
    return res.status(400).json({ error: 'Roll number required' });
  }

  const sql = `
    SELECT 
      course_id,
      course_name,
      category,
      marks,
      total_marks,
      status,
      updated_at
    FROM marks
    WHERE rollno = ?
    ORDER BY updated_at DESC
  `;

  db.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error('❌ Student Marks Error:', err);
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

app.post('/api/marks/get-by-class', (req, res) => {
  console.log('📥 GET MARKS:', req.body); // DEBUG

  const { year, department, section, courseId, category } = req.body;

  if (!year || !department || !section || !courseId || !category) {
    return res.status(400).json({ error: 'Missing required fields: year, department, section, courseId, category' });
  }

  const sql = `
    SELECT rollno, marks
    FROM marks
    WHERE year = ? AND dept = ? AND section = ? AND course_id = ? AND category = ?
    ORDER BY rollno ASC
  `;

  db.query(sql, [year, department, section, courseId, category], (err, results) => {
    if (err) {
      console.error('❌ Get Marks Error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    console.log(`✅ Found ${results.length} existing marks`);
    res.json(results);
  });
});

app.post('/api/marks/submit', (req, res) => {
  console.log('📥 SUBMIT MARKS:', req.body.classDetails); // DEBUG

  const { classDetails, marksData, teacher } = req.body;

  if (!classDetails || !marksData) {
    return res.status(400).json({ error: 'Missing classDetails or marksData' });
  }

  const { year, department: dept, section, courseId: course_id, courseName: course_name, category } = classDetails;

  const values = marksData.map(m => [
    m.rollNo, m.name, year, dept, section, course_id, course_name, category,
    parseInt(m.marks) || 0, 100,
    (parseInt(m.marks) || 0) >= 51 ? 'Pass' : 'Fail',
    teacher.rollno || 'unknown', teacher.name || 'Staff'
  ]);

  const sql = `
    INSERT INTO marks (rollno, name, year, dept, section, course_id, course_name, category, marks, total_marks, status, teacher_rollno, teacher_name)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      marks = VALUES(marks),
      status = VALUES(status),
      teacher_rollno = VALUES(teacher_rollno),
      teacher_name = VALUES(teacher_name)
  `;

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('❌ Marks Error:', err);
      return res.status(500).json({ error: 'Save failed: ' + err.message });
    }

    // Simple report (no complex query)
    const report = {
      totalStudents: marksData.length,
      passed: marksData.filter(m => parseInt(m.marks) >= 51).length,
      failed: marksData.filter(m => parseInt(m.marks) < 51).length,
      passPercentage: marksData.length > 0 ? ((marksData.filter(m => parseInt(m.marks) >= 51).length / marksData.length) * 100).toFixed(1) : 0,
      average: (marksData.reduce((sum, m) => sum + parseInt(m.marks), 0) / marksData.length || 0).toFixed(1),
      highestMark: Math.max(...marksData.map(m => parseInt(m.marks))),
      topperName: marksData.find(m => parseInt(m.marks) === Math.max(...marksData.map(m2 => parseInt(m2.marks))))?.name || 'N/A'
    };

    console.log('✅ Marks saved + Report:', report);
    res.json({ success: true, report });
  });
});

/* ================= STUDENT MARKS VIEWING ================= */
app.get('/api/student-marks', (req, res) => {
  const { rollno } = req.query;

  if (!rollno) {
    return res.status(400).json({ error: 'Roll number required' });
  }

  // Get ALL marks for this student across all courses/categories
  const sql = `
    SELECT 
      course_id,
      course_name,
      category,
      marks,
      total_marks,
      status,
      teacher_name,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as date_added,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i') as last_updated
    FROM marks 
    WHERE rollno = ? 
    ORDER BY category DESC, course_name ASC, created_at DESC
  `;

  db.query(sql, [rollno], (err, results) => {
    if (err) {
      console.error('❌ Student Marks Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Group by course for better display
    const marksByCourse = results.reduce((acc, mark) => {
      const key = `${mark.course_name} (${mark.course_id})`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(mark);
      return acc;
    }, {});

    console.log(`✅ Student ${rollno} marks fetched:`, Object.keys(marksByCourse).length, 'courses');
    res.json({
      rollno,
      totalCourses: results.length,
      marksByCourse,
      marksList: results // Raw list for table display
    });
  });
});


/* ================= START SERVER ================= */  

app.listen(5000, () => console.log("Server running on http://localhost:5000 🚀"));
