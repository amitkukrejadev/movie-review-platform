// backend/models/Review.js
import mongoose from "mongoose";

/**
 * Review schema supports two possible ways of linking a review to a movie:
 *  - movie: ObjectId -> references a local Movie document (preferred for seeded/local movies)
 *  - movieId: String -> arbitrary ID (e.g. TMDB numeric id) for external movies
 *
 * This avoids Mongoose ObjectId cast errors when the client uses numeric/string TMDB ids.
 */
const ReviewSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      index: true,
      required: false, // not always present for TMDB-only reviews
    },
    movieId: { type: String, index: true }, // for TMDB or other external ids
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    username: { type: String, default: "Guest" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String },
  },
  { timestamps: true }
);

const Review =
  mongoose.models?.Review || mongoose.model("Review", ReviewSchema);
export default Review;
