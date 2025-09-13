const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
  name: String,
  role: String
}, { _id: false });

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: { type: String, index: true },
  year: { type: Number, index: true },
  director: { type: String },
  cast: [castSchema],
  trailerUrl: { type: String },
  posterUrl: { type: String },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
