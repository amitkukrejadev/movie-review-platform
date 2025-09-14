// backend/models/Review.js
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      index: true,
    },
    movieId: { type: String, index: true }, // for TMDB ids
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    username: { type: String, default: "Guest" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review =
  mongoose.models?.Review || mongoose.model("Review", ReviewSchema);
export default Review;