import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Update user info
export const updateUser = async (req, res) => {
  try {
    const { userId, name, lastName, email, contactNumber, contactLink, gender } = req.body;

    // Prefer provided userId, otherwise use authenticated user id
    const id = userId || req.user?._id;
    if (!id) return res.status(400).json({ message: "Foydalanuvchi ID yoki autentifikatsiya talab qilinadi" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    // Foydalanuvchi ma'lumotlarini yangilash
    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.contactNumber = contactNumber || user.contactNumber;
    user.contactLink = contactLink || user.contactLink;
    user.gender = gender || user.gender;

    await user.save();

    // remove password from returned object
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: "Foydalanuvchi yangilandi ✅", user: userObj });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: err.message, error: err.message });
  }
};
