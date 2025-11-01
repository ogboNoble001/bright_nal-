// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRoute from "./routes/uploadRoute.js";
import apiKeyMiddleware from "./middleware/apikey.js";

dotenv.config();
const app = express();

// ---------- CORS Configuration ----------
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:7700',
  "http://127.0.0.1:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.static("public"));

// ---------- Upload Routes ----------
app.use("/secure", apiKeyMiddleware, uploadRoute);

// 🟢 Public (Safe)
app.get("/api/uploads", async (req, res, next) => {
  req.url = "/files";
  uploadRoute.handle(req, res, next);
});

app.get("/api/uploads/:id", async (req, res, next) => {
  req.url = `/${req.params.id}`;
  uploadRoute.handle(req, res, next);
});

// 🔒 Protected (Sensitive)
app.post("/api/uploads", apiKeyMiddleware, (req, res, next) => {
  req.url = "/";
  uploadRoute.handle(req, res, next);
});

app.put("/api/uploads/:id", apiKeyMiddleware, (req, res, next) => {
  req.url = `/${req.params.id}`;
  uploadRoute.handle(req, res, next);
});

app.delete("/api/uploads/:id", apiKeyMiddleware, (req, res, next) => {
  req.url = `/${req.params.id}`;
  uploadRoute.handle(req, res, next);
});

// ---------- API Key Access ----------
app.get("/api/key", (req, res) => {
  res.json({ key: process.env.API_KEY });
});

// ---------- 💳 Paystack Payment ----------
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

app.post("/verify-payment", async (req, res) => {
  const { reference } = req.body;
  if (!reference)
    return res.status(400).json({ success: false, message: "Reference is required" });
  
  try {
    const verify = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    
    const data = await verify.json();
    
    if (data.status && data.data.status === "success") {
      res.json({ success: true, message: "✅ Payment verified successfully!" });
    } else {
      res.json({ success: false, message: "❌ Payment verification failed." });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Server error verifying payment." });
  }
});

// ---------- Server ----------
const PORT = process.env.PORT || 7700;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));