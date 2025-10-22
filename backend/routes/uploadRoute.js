import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

cloudinary.v2.config({ secure: true });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
