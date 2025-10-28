import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

const createProductsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        product_name TEXT,
        category TEXT,
        brand TEXT,
        price NUMERIC(12,2) DEFAULT 0,
        stock INT DEFAULT 0,
        sku TEXT,
        product_class TEXT,
        sizes TEXT,
        colors TEXT,
        description TEXT,
        image_url TEXT NOT NULL,
        cloudinary_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Products table ready");
  } catch (err) {
    console.error("❌ Table creation error:", err.message);
  }
};
createProductsTable();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  },
});

// CREATE PRODUCT
router.post("/", upload.single("images"), async (req, res) => {
  let cloudinaryId = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    const { productName, category, brand, price, stock, sku, productClass, sizes, colors, description } = req.body;

    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "myAppUploads", tags: ["myApp"], resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    cloudinaryId = cloudinaryResult.public_id;

    const query = `
      INSERT INTO products 
      (product_name, category, brand, price, stock, sku, product_class, sizes, colors, description, image_url, cloudinary_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;
    const values = [
      productName || "Untitled Product",
      category || "Uncategorized",
      brand || "Unknown",
      price.toLocaleString() ? parseFloat(price) : 0,
      stock ? parseInt(stock) : 0,
      sku || `SKU-${Date.now()}`,
      productClass || "Standard",
      sizes || "N/A",
      colors || "N/A",
      description || "No description",
      cloudinaryResult.secure_url,
      cloudinaryResult.public_id,
    ];

    const dbResult = await pool.query(query, values);

    res.status(201).json({
      success: true,
      product: dbResult.rows[0],
      message: "Product uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Upload error:", error.message);

    if (cloudinaryId) await cloudinary.uploader.destroy(cloudinaryId);

    res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
});

// GET ALL PRODUCTS
router.get("/files", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Product not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT cloudinary_id FROM products WHERE id = $1", [id]);
    if (product.rows.length === 0) return res.status(404).json({ success: false, message: "Product not found" });

    await cloudinary.uploader.destroy(product.rows[0].cloudinary_id);
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
});

// UPDATE PRODUCT
router.put("/:id", upload.single("images"), async (req, res) => {
  let newCloudinaryId = null;
  try {
    const { id } = req.params;
    const { productName, category, brand, price, stock, sku, productClass, sizes, colors, description } = req.body;

    const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ success: false, message: "Product not found" });

    let imageUrl = existing.rows[0].image_url;
    let cloudinaryId = existing.rows[0].cloudinary_id;

    if (req.file) {
      await cloudinary.uploader.destroy(cloudinaryId);
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "myAppUploads", tags: ["myApp"] },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
      newCloudinaryId = uploadResult.public_id;
    }

    const result = await pool.query(
      `UPDATE products SET 
        product_name=$1, category=$2, brand=$3, price=$4, stock=$5, sku=$6, 
        product_class=$7, sizes=$8, colors=$9, description=$10, image_url=$11, cloudinary_id=$12
        WHERE id=$13 RETURNING *`,
      [
        productName || existing.rows[0].product_name,
        category || existing.rows[0].category,
        brand || existing.rows[0].brand,
        price ? parseFloat(price) : existing.rows[0].price,
        stock ? parseInt(stock) : existing.rows[0].stock,
        sku || existing.rows[0].sku,
        productClass || existing.rows[0].product_class,
        sizes || existing.rows[0].sizes,
        colors || existing.rows[0].colors,
        description || existing.rows[0].description,
        imageUrl,
        cloudinaryId,
        id,
      ]
    );

    res.json({ success: true, product: result.rows[0], message: "Product updated successfully" });
  } catch (error) {
    if (newCloudinaryId) await cloudinary.uploader.destroy(newCloudinaryId);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
});

export default router;