// models/elonModel.js
import mongoose from "mongoose";

const elonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    rooms: { type: Number, required: true },
    area: { type: Number, required: true },
    floor: { type: Number },
    furnished: { type: Boolean, default: false },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ["Faol", "Kelishilgan", "Yopilgan"],
      default: "Faol",
    },
  },
  { timestamps: true }
);

const Elon = mongoose.model("Elon", elonSchema);
export default Elon;
