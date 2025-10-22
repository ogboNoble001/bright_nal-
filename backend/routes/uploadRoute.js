import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

// Upload route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    const result = await cloudinary.uploader.upload(req.file.path);
    
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all uploads
router.get("/files", async (req, res) => {
  try {
    const result = await cloudinary.api.resources({ type: "upload", max_results: 100 });
    
    const files = result.resources.map(file => ({
      url: file.secure_url,
      name: file.public_id
    }));
    
    res.json(files);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;