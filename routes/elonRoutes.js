// routes/elonRoutes.js
import express from "express";
import {
  getElonlar,
  getElonById,
  createElon,
  updateElon,
  deleteElon,
  getMyElonlar,
} from "../controllers/elonController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔓 Barcha foydalanuvchilar uchun e’lonlar
router.get("/", getElonlar);

// 🔒 Faqat o‘z e’lonlarini olish
router.get("/my", protect, getMyElonlar);

// 🔒 Yangi e’lon yaratish
router.post("/", protect, createElon);

// 🔒 Bitta e’lonni olish (login bo‘lgan har kim)
router.get("/:id", getElonById);


// 🔒 E’lonni yangilash (faqat egasi yoki admin)
router.put("/:id", protect, updateElon);

// 🔒 E’lonni o‘chirish (faqat egasi yoki admin)
router.delete("/:id", protect, deleteElon);

export default router;
