// backend/models/Movie.js
import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    releaseYear: { type: Number },
    genres: [{ type: String }],
    posterUrl: { type: String },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tmdbId: { type: String },
  },
  { timestamps: true }
);

const Movie = mongoose.models?.Movie || mongoose.model("Movie", MovieSchema);
export default Movie;
