import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Ro‘yxatdan o‘tish (REGISTER)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email allaqachon mavjudmi?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email allaqachon mavjud" });
    }

    // Yangi user yaratish
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Foydalanuvchi yaratildi ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login qilish
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Parol noto‘g‘ri" });
    }

    // JWT token yaratish
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Tizimga kirish muvaffaqiyatli ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
