// backend/models/Movie.js
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: String,
  year: Number,
  director: String,
  description: String,
  posterUrl: String,
  numReviews: { type: Number, default: 0 },
});

export default mongoose.model("Movie", movieSchema);
