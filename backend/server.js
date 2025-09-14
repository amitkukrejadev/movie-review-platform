// backend/server.js
import dotenv from "dotenv";
dotenv.config(); // MUST run before other imports that read process.env

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import movieRoutes from "./routes/movies.js";

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("ENV debug — cwd:", process.cwd());
console.log(
  "ENV debug — TMDB_KEY present?",
  !!process.env.TMDB_KEY,
  "masked:",
  process.env.TMDB_KEY ? process.env.TMDB_KEY.slice(0, 6) + "..." : "(none)"
);

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO ||
  "mongodb://127.0.0.1:27017/moviesdb";

// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// API routes
app.use("/movies", movieRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ serve frontend build (for Render deploy)
const frontendDist = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDist));
app.get("*", (req, res, next) => {
  // if API route, skip to next
  if (req.path.startsWith("/movies") || req.path.startsWith("/api"))
    return next();
  res.sendFile(path.join(frontendDist, "index.html"));
});

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