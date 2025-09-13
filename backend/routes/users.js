// backend/routes/users.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Movie = require("../models/Movie");

// GET /api/users/:id  -> public profile (reviews + basic info)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("watchlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/:id  -> update profile (protected, same user)
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.profilePic = req.body.profilePic || user.profilePic;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:id/watchlist
router.get("/:id/watchlist", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Forbidden" });
    const user = await User.findById(req.params.id).populate("watchlist");
    res.json(user.watchlist || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/:id/watchlist  -> add movie
router.post("/:id/watchlist", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Forbidden" });
    const { movieId } = req.body;
    const user = await User.findById(req.params.id);
    if (user.watchlist.find((id) => id.toString() === movieId)) {
      return res.status(400).json({ message: "Already in watchlist" });
    }
    user.watchlist.push(movieId);
    await user.save();
    const populated = await User.findById(req.params.id).populate("watchlist");
    res.json(populated.watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/users/:id/watchlist/:movieId -> remove movie
router.delete("/:id/watchlist/:movieId", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Forbidden" });
    const user = await User.findById(req.params.id);
    user.watchlist = user.watchlist.filter(
      (id) => id.toString() !== req.params.movieId
    );
    await user.save();
    const populated = await User.findById(req.params.id).populate("watchlist");
    res.json(populated.watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
