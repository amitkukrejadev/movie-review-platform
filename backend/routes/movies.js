// backend/routes/movies.js
import express from "express";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

const router = express.Router();

/* ----------------- small helpers & cache ----------------- */

// simple in-memory cache for TMDB results (optional, helps avoid brief rate/network spikes)
const tmdbCache = new Map(); // key => { expires: timestamp, data }
function cacheGet(key) {
  const v = tmdbCache.get(key);
  if (!v) return null;
  if (v.expires < Date.now()) {
    tmdbCache.delete(key);
    return null;
  }
  return v.data;
}
function cacheSet(key, data, ttl = 60_000) {
  tmdbCache.set(key, { expires: Date.now() + ttl, data });
}

async function fetchWithRetry(url, opts = {}, attempts = 2) {
  try {
    return await fetch(url, opts);
  } catch (e) {
    if (attempts <= 1) throw e;
    await new Promise((r) => setTimeout(r, 500));
    return fetchWithRetry(url, opts, attempts - 1);
  }
}

function isObjectIdString(str) {
  return typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str);
}

/* ----------------- movie list (TMDB fallback) ----------------- */
/**
 * GET /movies?page=&limit=&search=
 * - If TMDB_KEY is set we call TMDB (trending/search).
 * - Otherwise read from local Mongo `Movie` collection.
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search?.trim();

    const TMDB_KEY = process.env.TMDB_KEY || process.env.VITE_TMDB_KEY;
    if (TMDB_KEY) {
      const cacheKey = `tmdb:${search || "trending"}:p${page}`;
      const cached = cacheGet(cacheKey);
      if (cached) return res.json(cached);

      const base = "https://api.themoviedb.org/3";
      const url = search
        ? `${base}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
            search
          )}&page=${page}`
        : `${base}/trending/movie/week?api_key=${TMDB_KEY}&page=${page}`;

      const tmdbRes = await fetchWithRetry(url);
      if (!tmdbRes.ok) {
        const txt = await tmdbRes.text().catch(() => "");
        throw new Error(`TMDB ${tmdbRes.status} ${txt}`);
      }
      const data = await tmdbRes.json();

      const payload = {
        page: data.page || page,
        totalPages: data.total_pages || 1,
        total: data.total_results || (data.results || []).length,
        movies: (data.results || []).map((m) => ({
          id: String(m.id),
          title: m.title || m.name,
          description: m.overview || "",
          releaseYear: m.release_date
            ? new Date(m.release_date).getFullYear()
            : null,
          posterUrl: m.poster_path
            ? `https://image.tmdb.org/t/p/w342${m.poster_path}`
            : null,
          rating: m.vote_average || 0,
        })),
      };

      cacheSet(cacheKey, payload, 30_000);
      return res.json(payload);
    }

    // fallback to local DB
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.search) {
      const s = req.query.search.trim();
      filter.$or = [
        { title: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
      ];
    }

    const total = await Movie.countDocuments(filter);
    const movies = await Movie.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      total,
      movies: movies.map((m) => ({
        id: String(m._id),
        title: m.title,
        description: m.description || "",
        releaseYear: m.releaseYear || null,
        posterUrl: m.posterUrl || null,
        rating: m.rating || 0,
      })),
    });
  } catch (err) {
    console.error("GET /movies error:", err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

/* ----------------- reviews endpoints ----------------- */

/**
 * GET /movies/:id/reviews
 *
 * If :id looks like a Mongo ObjectId -> query Review.movie (ObjectId).
 * Otherwise attempt to match movieId (string) OR review.movie as string to be defensive.
 */
router.get("/:id/reviews", async (req, res) => {
  try {
    const rawId = String(req.params.id || "");
    let query;

    if (isObjectIdString(rawId)) {
      query = { movie: rawId };
    } else {
      // Check movieId (TMDB id stored on review) OR movie field stored as string
      query = { $or: [{ movieId: rawId }, { movie: rawId }] };
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name username")
      .lean();

    return res.json(reviews);
  } catch (err) {
    console.error("GET /movies/:id/reviews error:", err);
    return res.status(400).json({ message: err?.message || "Bad request" });
  }
});

/**
 * POST /movies/:id/reviews
 *
 * If :id is ObjectId -> set review.movie
 * otherwise set review.movieId (string) so Mongoose won't try to cast to ObjectId
 */
router.post("/:id/reviews", async (req, res) => {
  try {
    const rawId = String(req.params.id || "");
    const { rating, comment, username } = req.body || {};

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "rating and comment are required" });
    }

    const doc = {
      rating: Number(rating),
      comment,
      username: username || "Guest",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isObjectIdString(rawId)) {
      doc.movie = rawId;
    } else {
      doc.movieId = rawId;
    }

    const review = await Review.create(doc);

    const full = await Review.findById(review._id)
      .populate("user", "name username")
      .lean();

    return res.status(201).json(full || review);
  } catch (err) {
    console.error("POST /movies/:id/reviews error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
