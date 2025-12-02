// routes/userRoutes.js
import express from "express";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// e'lonni saqlanganlarga qo'shish
router.post("/save-elon/:elonId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const elonId = req.params.elonId;

    if (!user.savedElons.includes(elonId)) {
      user.savedElons.push(elonId);
      await user.save();
    }

    res.status(200).json({ message: "E'lon saqlandi", savedElons: user.savedElons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// e'lonni saqlanganlardan o'chirish
router.delete("/save-elon/:elonId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const elonId = req.params.elonId;

    user.savedElons = user.savedElons.filter(id => id.toString() !== elonId);
    await user.save();

    res.status(200).json({ message: "E'lon saqlanganlardan o'chirildi", savedElons: user.savedElons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// foydalanuvchining barcha saqlangan e'lonlari
router.get("/saved-elons", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedElons");
    res.status(200).json(user.savedElons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
