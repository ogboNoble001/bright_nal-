import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Neon database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Connected to Neon PostgreSQL successfully",
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ error: "❌ Database connection failed", details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
