// backend/routes/users.js
import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
