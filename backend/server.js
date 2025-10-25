// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoute from "./routes/uploadRoute.js";
import apiKeyMiddleware from "./middleware/apikey.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Protected secure routes
app.use("/secure", apiKeyMiddleware, uploadRoute);

// Proxy routes for frontend (no node-fetch)
app.get("/api/uploads", async (req, res, next) => {
  // Call the same handler as /secure/files directly
  req.url = "/files";
  uploadRoute.handle(req, res, next);
});

app.get("/api/uploads/:id", async (req, res, next) => {
  req.url = `/${req.params.id}`;
  uploadRoute.handle(req, res, next);
});

app.post("/api/uploads", (req, res, next) => {
  req.url = "/";
  uploadRoute.handle(req, res, next);
});

app.put("/api/uploads/:id", (req, res, next) => {
  req.url = `/${req.params.id}`;
  uploadRoute.handle(req, res, next);
});

app.delete("/api/uploads/:id", (req, res, next) => {
  req.url = `/${req.params.id}`;
  uploadRoute.handle(req, res, next);
});

const PORT = process.env.PORT || 7700;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
