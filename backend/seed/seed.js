// backend/seed/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Movie = require("../models/Movie");
const User = require("../models/User");
const Review = require("../models/Review");

const movies = [
  {
    title: "Edge of Tomorrow",
    description:
      "A soldier fighting aliens gets to relive the same day over and over, the key to defeating them.",
    genre: "Sci-Fi",
    year: 2014,
    director: "Doug Liman",
    cast: [
      { name: "Tom Cruise", role: "Cage" },
      { name: "Emily Blunt", role: "Rita" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=vw61gCe2oqI",
    posterUrl: "https://via.placeholder.com/300x450?text=Edge+of+Tomorrow",
  },
  {
    title: "The Grand Budapest Hotel",
    description:
      "Adventures of a legendary concierge and his lobby boy at a famous European hotel.",
    genre: "Comedy",
    year: 2014,
    director: "Wes Anderson",
    cast: [{ name: "Ralph Fiennes", role: "M. Gustave" }],
    trailerUrl: "https://www.youtube.com/watch?v=1Fg5iWmQjwk",
    posterUrl: "https://via.placeholder.com/300x450?text=Grand+Budapest",
  },
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given one last job.",
    genre: "Sci-Fi",
    year: 2010,
    director: "Christopher Nolan",
    cast: [{ name: "Leonardo DiCaprio", role: "Cobb" }],
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    posterUrl: "https://via.placeholder.com/300x450?text=Inception",
  },
  {
    title: "The Social Network",
    description:
      "The story of the founding of Facebook and the lawsuits that followed.",
    genre: "Drama",
    year: 2010,
    director: "David Fincher",
    cast: [{ name: "Jesse Eisenberg", role: "Mark Zuckerberg" }],
    trailerUrl: "https://www.youtube.com/watch?v=lB95KLmpLR4",
    posterUrl: "https://via.placeholder.com/300x450?text=Social+Network",
  },
  {
    title: "Mad Max: Fury Road",
    description:
      "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.",
    genre: "Action",
    year: 2015,
    director: "George Miller",
    cast: [
      { name: "Tom Hardy", role: "Max" },
      { name: "Charlize Theron", role: "Furiosa" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=hEJnMQG9ev8",
    posterUrl: "https://via.placeholder.com/300x450?text=Mad+Max",
  },
  {
    title: "Parasite",
    description:
      "A poor family schemes to become employed by a wealthy family and infiltrate their household.",
    genre: "Thriller",
    year: 2019,
    director: "Bong Joon-ho",
    cast: [{ name: "Song Kang-ho", role: "Kim Ki-taek" }],
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    posterUrl: "https://via.placeholder.com/300x450?text=Parasite",
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Movie.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    const createdMovies = await Movie.insertMany(movies);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: "password123",
      isAdmin: true,
    });
    const user = await User.create({
      name: "Tester",
      email: "user@example.com",
      password: "password123",
    });

    const review = await Review.create({
      user: user._id,
      movie: createdMovies[0]._id,
      rating: 5,
      comment: "Loved it",
    });
    createdMovies[0].numReviews = 1;
    createdMovies[0].rating = 5;
    await createdMovies[0].save();

    console.log("Seed complete");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
