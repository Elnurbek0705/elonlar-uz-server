import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Ro‘yxatdan o‘tish (REGISTER)
export const registerUser = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email allaqachon mavjud" });
    }

    const newUser = new User({
      name,
      lastName,
      email,
      password,
      contactNumber: req.body.contactNumber || "",
      contactLink: req.body.contactLink || "",
      gender: req.body.gender || "male",
    });

    await newUser.save();

    res.status(201).json({ message: "Foydalanuvchi yaratildi ✅" });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
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

    // Return full user profile (without password) so frontend can populate settings
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Tizimga kirish muvaffaqiyatli ✅",
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Joriy autentifikatsiyalangan foydalanuvchini qaytarish
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(401).json({ message: "Autentifikatsiya talab qilinadi" });
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
