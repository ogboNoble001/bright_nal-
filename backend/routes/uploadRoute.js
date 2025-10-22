import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

router.post("/", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: "No files uploaded" });
    
    const { productName, category, brand, price, stock, sku, productClass, sizes, colors, description } = req.body;
    const uploadedFiles = [];
    
    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
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
          },
          (error, result) => error ? reject(error) : resolve(result)
        );
        stream.end(file.buffer);
      });
      
      uploadedFiles.push({
        url: result.secure_url,
        publicId: result.public_id,
        productName: result.context?.productName || "N/A",
        category: result.context?.category || "N/A",
        brand: result.context?.brand || "N/A",
        price: result.context?.price || "0",
        stock: result.context?.stock || "0",
        sku: result.context?.sku || "N/A",
        productClass: result.context?.productClass || "N/A",
        sizes: result.context?.sizes || "N/A",
        colors: result.context?.colors || "N/A",
        description: result.context?.description || "N/A",
      });
    }
    
    res.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/files", async (req, res) => {
  try {
    const result = await cloudinary.api.resources_by_tag("myApp", { max_results: 100, context: true });
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
    console.error("Fetch uploads error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;