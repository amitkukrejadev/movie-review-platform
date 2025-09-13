// backend/seed/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "../models/Movie.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const movies = [
  {
    title: "Inception",
    genre: "Sci-Fi",
    year: 2010,
    director: "Christopher Nolan",
    description: "A thief enters dreams to steal secrets.",
    posterUrl: "/8ZTVqvKDQ8emSGUesE7o5GNJ7ey.jpg",
  },
  {
    title: "Fight Club",
    genre: "Drama",
    year: 1999,
    director: "David Fincher",
    description:
      "An insomniac and a soap salesman form underground fight clubs.",
    posterUrl: "/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg",
  },
  {
    title: "The Matrix",
    genre: "Sci-Fi",
    year: 1999,
    director: "Wachowskis",
    description: "A hacker discovers a simulated reality.",
    posterUrl: "/f89U3ADr1oiB1s9GkdPOEpXUk5d.jpg",
  },
];

async function seed() {
  await Movie.deleteMany({});
  await Movie.insertMany(movies);
  console.log("Database seeded");
  mongoose.connection.close();
}

seed();
