import { verifyToken } from "../middleware/auth.js";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import express from "express";

const router = express.Router(); 

// GET bookmarked skills
// backend route
router.get("/bookmarked", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("bookmarkedSkills");
    res.json(user.bookmarkedSkills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a bookmark
router.post("/bookmark/:skillId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const skillId = req.params.skillId;

    if (!user.bookmarkedSkills.includes(skillId)) {
      user.bookmarkedSkills.push(skillId);
      await user.save();
    }

    res.status(200).json({ success: true, message: "Skill bookmarked!" });
  } catch (err) {
 
    res.status(400).json({ success: false, message: "Bookmark failed" });
  }
});

export default router;
