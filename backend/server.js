import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend (optional, for Render full-stack)
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "clothes_showcase",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

const upload = multer({ storage });

// Mongoose schema
const clothesSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const Clothes = mongoose.model("Clothes", clothesSchema);

// === Routes ===

// Upload new clothing item
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const imageUrl = req.file.path;
    
    const newItem = new Clothes({
      name,
      description,
      price,
      category,
      imageUrl
    });
    
    await newItem.save();
    res.status(201).json({ message: "Item uploaded successfully", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all clothes
app.get("/api/clothes", async (req, res) => {
  try {
    const items = await Clothes.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));