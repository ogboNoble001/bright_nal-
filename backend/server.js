import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from "pg";
import uploadRoute from "./routes/uploadRoute.js";
import apiKeyMiddleware from "./middleware/apikey.js";

dotenv.config();
const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Protect /upload route with API key
app.use("/upload", apiKeyMiddleware, uploadRoute);

// --------------------------
// Secure proxy routes
// --------------------------
import fetch from "node-fetch"; // make sure node-fetch is installed

// Forward request to protected route
async function forwardRequest(req, res, method, path = "") {
  try {
    let options = {
      method,
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    };

    if (method === "POST" || method === "PUT") {
      options.body = req.body instanceof FormData ? req.body : JSON.stringify(req.body);
      options.headers["Content-Type"] = req.body instanceof FormData ? undefined : "application/json";
    }

    const url = `http://localhost:${process.env.PORT || 7700}/upload${path}`;
    const response = await fetch(url, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Proxy routes for frontend
app.get("/secure/files", (req, res) => forwardRequest(req, res, "GET", "/files"));
app.get("/secure/:id", (req, res) => forwardRequest(req, res, "GET", `/${req.params.id}`));
app.post("/secure-upload", (req, res) => forwardRequest(req, res, "POST"));
app.put("/secure-upload/:id", (req, res) => forwardRequest(req, res, "PUT", `/${req.params.id}`));
app.delete("/secure/:id", (req, res) => forwardRequest(req, res, "DELETE", `/${req.params.id}`));

// Root test
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
