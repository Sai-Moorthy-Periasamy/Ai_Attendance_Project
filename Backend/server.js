import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Saimoorthy2004@gmail",
  database: "ai_attendance",
});


app.post("/signup", async (req, res) => {
  const { rollno, email, password, profession, name, year, dept, section } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (rollno, email, password, profession, name, year, dept, section) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [rollno, email, hashedPassword, profession, name, year, dept, section], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Signup success" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/students", (req, res) => {
  const { year, dept, section } = req.query;

  const sql = `
    SELECT rollno, name 
    FROM users
    WHERE year = ? AND dept = ? AND section = ? AND profession = 'student'
  `;

  db.query(sql, [year, dept, section], (err, results) => {
    if (err) return res.status(500).json(err);

    // Default all as ABSENT
    const students = results.map((s) => ({
      rollno: s.rollno,
      name: s.name,
      status: "Absent",
    }));

    res.json(students);
  });
});


app.post("/login", (req, res) => {
  const { email, password, profession } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND profession = ?";
  db.query(sql, [email, profession], async (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login success", user });
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
