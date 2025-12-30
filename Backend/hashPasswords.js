import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Saimoorthy2004@gmail",
  database: "ai_attendance",
});

console.log("Connected to database");

const hashPasswords = async () => {
  try {
    const [results] = await db.execute("SELECT id, password FROM users");

    for (const user of results) {
      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (!user.password.startsWith('$2b$')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id]);
        console.log(`Updated password for user ID ${user.id}`);
      }
    }
    console.log("Password hashing complete");
  } catch (err) {
    console.error(err);
  } finally {
    await db.end();
  }
};

hashPasswords();
