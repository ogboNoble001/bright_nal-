import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const router = express.Router();
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

// POST: Upload file
router.post("/", upload.single("images"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { productName, category, brand, price, stock, sku, productClass, sizes, colors, description } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "myAppUploads",
      tags: ["myApp"],
      context: {
        productName: productName || "N/A",
        category: category || "N/A",
        brand: brand || "N/A",
        price: price || "0",
        stock: stock || "0",
        sku: sku || "N/A",
        productClass: productClass || "N/A",
        sizes: sizes || "N/A",
        colors: colors || "N/A",
        description: description || "N/A",
      },
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      file: {
        url: result.secure_url,
        publicId: result.public_id,
        productName: productName || "N/A",
        category: category || "N/A",
        brand: brand || "N/A",
        price: price || "0",
        stock: stock || "0",
        sku: sku || "N/A",
        productClass: productClass || "N/A",
        sizes: sizes || "N/A",
        colors: colors || "N/A",
        description: description || "N/A",
      }
    });
  } catch (error) {
    // Cleanup temp file on error
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error deleting temp file:", err);
      }
    }
    
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Upload failed" 
    });
  }
});

// GET: Fetch all uploads
router.get("/files", async (req, res) => {
  try {
    const result = await cloudinary.api.resources_by_tag("myApp", { 
      max_results: 100, 
      context: true 
    });

    const files = result.resources.map(file => ({
      url: file.secure_url,
      publicId: file.public_id,
      productName: file.context?.productName || "N/A",
      category: file.context?.category || "N/A",
      brand: file.context?.brand || "N/A",
      price: file.context?.price || "0",
      stock: file.context?.stock || "0",
      sku: file.context?.sku || "N/A",
      productClass: file.context?.productClass || "N/A",
      sizes: file.context?.sizes || "N/A",
      colors: file.context?.colors || "N/A",
      description: file.context?.description || "N/A",
    }));

    res.json(files);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch files" 
    });
  }
});

export default router;