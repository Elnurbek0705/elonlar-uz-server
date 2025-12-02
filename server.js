import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import elonRoutes from "./routes/elonRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();

// ⚙️ Middleware — tartib MUHIM!
app.use(cors());
app.use(express.json());

// 🔹 Fayl yuklash uchun middleware avval bo‘lishi kerak
app.use(fileUpload({ useTempFiles: true }));

// 🔹 Cloudinary sozlamalari
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// 🔹 Routelar
app.use("/api/auth", authRoutes);
app.use("/api/elons", elonRoutes);
app.use("/api/users", userRoutes);

// MongoDB ulanishi
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch((err) => console.log("❌ MongoDB xato:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Elonlar.uz backend ishlayapti 🚀");
});

// Serverni ishga tushurish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server ${PORT}-portda ishlayapti`));
