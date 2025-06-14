import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  bio: String,
  skills: [String],
  avatar: String, // optional
}, { timestamps: true });

export default mongoose.model("Skill", skillSchema);
