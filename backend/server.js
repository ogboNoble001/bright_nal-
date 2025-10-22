import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();

// Detect environment and set CORS origin dynamically
const allowedOrigins = [
  "http://127.0.0.1:3000",     // Local frontend
  "http://localhost:7700",     // Optional for dev
  "https://bright-nal-frontend.onrender.com", // Replace with your hosted frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked for origin: " + origin));
      }
    },
  })
);

app.use(express.json());

// Connect to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Connected to Neon PostgreSQL successfully",
      backendPort: PORT,
      frontendHint: "http://127.0.0.1:3000 or your hosted frontend",
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      error: "❌ Database connection failed",
      details: err.message,
    });
  }
});

// Detect render/local ports
const PORT = process.env.PORT || 7700;

app.listen(PORT, () => {
  const mode = process.env.PORT ? "Render (Hosted)" : "Local Development";
  console.log(`🚀 Server running on port ${PORT} [${mode}]`);
});
