// backend/server.js
import dotenv from "dotenv";
dotenv.config(); // MUST run before other imports that read process.env

console.log("ENV debug — cwd:", process.cwd());
console.log(
  "ENV debug — TMDB_KEY present?",
  !!process.env.TMDB_KEY,
  "masked:",
  process.env.TMDB_KEY ? process.env.TMDB_KEY.slice(0, 6) + "..." : "(none)"
);

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// ... other imports
import movieRoutes from "./routes/movies.js";

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO ||
  "mongodb://127.0.0.1:27017/moviesdb";

// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// routes
app.use("/movies", movieRoutes);

// basic health
app.get("/", (req, res) => res.json({ ok: true }));

// connect + listen
mongoose
  .connect(MONGO, { autoIndex: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error(
      "MongoDB connect error:",
      err && err.message ? err.message : err
    );
    process.exit(1);
  });
