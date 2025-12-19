// routes/userRoutes.js
import express from "express";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateUser } from "../controllers/userController.js";


const router = express.Router();

router.put("/update", protect, updateUser);
router.post("/update", protect, updateUser);



// e'lonni saqlanganlarga qo'shish (atomik yangilanish)
router.post("/save-elon/:elonId", protect, async (req, res) => {
  try {
    const elonId = req.params.elonId;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedElons: elonId } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    res.status(200).json({ message: "E'lon saqlandi", savedElons: updatedUser.savedElons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// e'lonni saqlanganlardan o'chirish (atomik yangilanish)
router.delete("/save-elon/:elonId", protect, async (req, res) => {
  try {
    const elonId = req.params.elonId;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedElons: elonId } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    res.status(200).json({ message: "E'lon saqlanganlardan o'chirildi", savedElons: updatedUser.savedElons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// foydalanuvchining barcha saqlangan e'lonlari
router.get("/saved-elons", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedElons");
    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    res.status(200).json(user.savedElons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
