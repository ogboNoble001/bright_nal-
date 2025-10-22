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

router.post("/", upload.single("images"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    const { productName, category, brand, price, stock, sku, productClass, sizes, colors, description, featured, onSale, newArrival } = req.body;
    
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
        description: description || "N/A"
      }
    });
    
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// Get all uploads
router.get("/files", async (req, res) => {
  try {
    const result = await cloudinary.api.resources_by_tag("myApp", { 
      max_results: 100,
      context: true 
    });
    
    const files = result.resources.map(file => ({
      url: file.secure_url,
      name: file.public_id,
      productName: file.context?.productName || "N/A",
      category: file.context?.category || "N/A",
      brand: file.context?.brand || "N/A",
      price: file.context?.price || "0",
      stock: file.context?.stock || "0",
      sku: file.context?.sku || "N/A",
      productClass: file.context?.productClass || "N/A",
      sizes: file.context?.sizes || "N/A",
      colors: file.context?.colors || "N/A",
      description: file.context?.description || "N/A"
    }));
    
    res.json(files);
  } catch (error) {
    console.error("Error fetching uploads:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;