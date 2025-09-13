const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/auth');

// GET /api/movies?search=&genre=&year=&minRating=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.minRating) filter.rating = { $gte: Number(req.query.minRating) };

    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({ page, totalPages: Math.ceil(total / limit), total, movies });
  } catch (err) {
    console.error('GET /api/movies error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    const reviews = await Review.find({ movie: movie._id }).populate('user', 'name');
    res.json({ ...movie, reviews });
  } catch (err) {
    console.error('GET /api/movies/:id error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/movies/:id/reviews (protected)
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating 1-5 required' });

    const existing = await Review.findOne({ user: req.user._id, movie: movie._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this movie' });

    const review = await Review.create({
      user: req.user._id,
      movie: movie._id,
      rating: Number(rating),
      comment: comment || ''
    });

    // update movie rating summary
    const reviews = await Review.find({ movie: movie._id });
    movie.numReviews = reviews.length;
    movie.rating = Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1));
    await movie.save();

    res.status(201).json(review);
  } catch (err) {
    console.error('POST /api/movies/:id/reviews error', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
