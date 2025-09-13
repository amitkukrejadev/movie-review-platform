// backend/routes/movies.js
import express from "express";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import auth from "../middleware/auth.js"; // optional, adjust to your middleware

const router = express.Router();

// GET /movies (example)
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search)
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.minRating)
      filter.rating = { $gte: Number(req.query.minRating) };

    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ page, totalPages: Math.ceil(total / limit), total, movies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /movies/:id
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    const reviews = await Review.find({ movie: movie._id }).populate(
      "user",
      "name"
    );
    res.json({ ...movie, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /movies/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// POST /movies/:id/reviews (example protected / adjust auth)
router.post(
  "/:id/reviews",
  /* auth, */ async (req, res) => {
    try {
      const { rating, comment, username } = req.body;
      // validation + save logic...
      const review = new Review({
        movieId: req.params.id,
        rating: Number(rating),
        comment,
        username: username || "Guest",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await review.save();
      res.status(201).json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
