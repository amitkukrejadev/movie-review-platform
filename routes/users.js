const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Movie = require('../models/Movie');

// GET /api/users/:id  -> public profile (reviews + basic info)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('watchlist');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/:id  -> update profile (protected, same user)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.profilePic = req.body.profilePic || user.profilePic;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/:id/watchlist
router.get('/:id/watchlist', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin)
      return res.status(403).json({ message: 'Forbidden' });
    const user = await User.findById(req.params.id).populate('watchlist');
    res.json(user.watchlist || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/:id/watchlist  -> add movie
cat > seed/seed.js <<'JS'
require('dotenv').config();
const connectDB = require('../config/db');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Review = require('../models/Review');

const movies = [
  {
    title: 'Edge of Tomorrow',
    description: 'A soldier fighting aliens gets to relive the same day over and over, the key to defeating them.',
    genre: 'Sci-Fi',
    year: 2014,
    director: 'Doug Liman',
    cast: [{ name: 'Tom Cruise', role: 'Cage' }, { name: 'Emily Blunt', role: 'Rita' }],
    trailerUrl: 'https://www.youtube.com/watch?v=vw61gCe2oqI',
    posterUrl: 'https://via.placeholder.com/300x450?text=Edge+of+Tomorrow'
  },

... (truncated for brevity)
