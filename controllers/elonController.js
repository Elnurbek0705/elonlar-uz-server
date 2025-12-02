// controllers/elonController.js
import Elon from "../models/elonModel.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// ✅ Barcha e’lonlarni olish (hammaga ochiq)
export const getElonlar = async (req, res) => {
  try {
    const elonlar = await Elon.find().populate("user", "name role");
    res.status(200).json(elonlar);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Bitta e’lonni ID orqali olish
export const getElonById = async (req, res) => {
  try {
    const elon = await Elon.findById(req.params.id).populate("user", "name email role");
    if (!elon) return res.status(404).json({ message: "E’lon topilmadi" });
    res.json(elon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Yangi e’lon yaratish
export const createElon = async (req, res) => {
  try {
    const { title, price, location, rooms, area, floor, furnished, description, status } =
      req.body;

    if (!title || !price || !location || !rooms || !area || !description) {
      return res.status(400).json({ message: "Barcha majburiy maydonlarni to‘ldiring" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Rasm fayl majburiy" });
    }

    const file = req.files.image;

    // Cloudinary'ga yuklash
    const uploadRes = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "elonlar_uz",
      use_filename: true,
    });

    fs.unlinkSync(file.tempFilePath);

    const newElon = await Elon.create({
      user: req.user._id,
      title,
      price,
      location,
      rooms,
      area,
      floor,
      furnished,
      description,
      status: status || "Faol",
      image: uploadRes.secure_url,
    });

    res.status(201).json(newElon);
  } catch (err) {
    console.error("E’lon yaratishda xato:", err);
    res.status(500).json({ message: "E’lonni yaratishda xatolik", error: err.message });
  }
};

// ✅ E’lonni yangilash
export const updateElon = async (req, res) => {
  try {
    const elon = await Elon.findById(req.params.id);
    if (!elon) return res.status(404).json({ message: "E’lon topilmadi" });

    if (String(elon.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Sizga tegishli e’lon emas" });
    }

    const updated = await Elon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "E’lonni yangilashda xatolik", error: err.message });
  }
};

// ✅ E’lonni o‘chirish
export const deleteElon = async (req, res) => {
  try {
    const elon = await Elon.findById(req.params.id);
    if (!elon) return res.status(404).json({ message: "E’lon topilmadi" });

    if (String(elon.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Bu e’lonni o‘chirish huquqiga ega emassiz" });
    }

    await elon.deleteOne();
    res.json({ message: "E’lon o‘chirildi ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Foydalanuvchining o‘z e’lonlarini olish
export const getMyElonlar = async (req, res) => {
  try {
    const myElonlar = await Elon.find({ user: req.user._id });
    res.status(200).json(myElonlar);
  } catch (err) {
    res.status(500).json({ message: "Elonlaringizni olishda xato yuz berdi" });
  }
};
