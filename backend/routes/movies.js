// backend/routes/movies.js
import express from "express";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  try {
    const movies = await Movie.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ movies });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/reviews", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      userId: req.user.id,
      movieId: req.params.id,
      rating,
      comment,
    });
    await review.save();
    await Movie.findByIdAndUpdate(req.params.id, { $inc: { numReviews: 1 } });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id }).populate(
      "userId",
      "username"
    );
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
