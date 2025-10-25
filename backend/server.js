import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";
import uploadRoute from "./routes/uploadRoute.js";
import apiKeyMiddleware from "./middleware/apikey.js"; // API key middleware
import fetch from "node-fetch"; // fetch for Node

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves HTML page

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --------------------------
// Protect /upload route with API key
app.use("/upload", apiKeyMiddleware, uploadRoute);
// --------------------------

// Proxy route for frontend to call without exposing API key
app.post("/secure-upload", async (req, res) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/upload`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Home route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Connected to Neon PostgreSQL successfully",
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ error: "❌ Database connection failed", details: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 7700;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
