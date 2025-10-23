import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;
const router = express.Router();

// Configure PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -----------------
// POST: Upload product
// -----------------
router.post("/", upload.single("images"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const { productName, category, brand, price, stock, sku, productClass, sizes, colors, description } = req.body;

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "myAppUploads", tags: ["myApp"] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Save product info to PostgreSQL
    const query = `
      INSERT INTO products 
        (product_name, category, brand, price, stock, sku, product_class, sizes, colors, description, image_url, cloudinary_id)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;
    const values = [
      productName || null,
      category || null,
      brand || null,
      price ? Number(price) : null,
      stock ? Number(stock) : null,
      sku || null,
      productClass || null,
      sizes || null,
      colors || null,
      description || null,
      result.secure_url,
      result.public_id
    ];

    const dbResult = await pool.query(query, values);

    res.json({ success: true, product: dbResult.rows[0] });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// -----------------
// GET: Fetch all products
// -----------------
router.get("/files", async (req, res) => {
  try {
    const dbResult = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(dbResult.rows);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
