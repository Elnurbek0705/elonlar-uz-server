import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Header ichida token borligini tekshiramiz
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Tokenni tekshirish
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token ichidagi foydalanuvchi ID bo‘yicha foydalanuvchini topamiz
      req.user = await User.findById(decoded.id).select("-password");

      next(); // keyingi bosqichga o‘tish
    } else {
      return res.status(401).json({ message: "Token topilmadi ❌" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token yaroqsiz yoki muddati tugagan ❌" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Faqat adminlar uchun ruxsat berilgan" });
  }
};
