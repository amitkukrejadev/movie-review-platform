// backend/models/Review.js
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
      index: true,
    },
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
