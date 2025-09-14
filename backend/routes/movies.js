// backend/routes/movies.js
import express from "express";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

const router = express.Router();

/* ----------------- small helpers & cache ----------------- */

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

/* ----------------- GET /movies (TMDB with fallback) ----------------- */
/**
 * GET /movies?page=&limit=&search=
 * - If TMDB_KEY is set we call TMDB (trending/search) — but if TMDB fails we fallback to local DB.
 * - Otherwise return local DB movies.
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = (req.query.search || "").trim();

    const TMDB_KEY = process.env.TMDB_KEY || process.env.VITE_TMDB_KEY;

    // If we have TMDB key: try TMDB first but on error fall back to local DB
    if (TMDB_KEY) {
      try {
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
      } catch (tmdbErr) {
        // TMDB failed (network, rate, etc.). Log and continue to fallback below.
        console.error(
          "TMDB fetch failed — falling back to local DB:",
          tmdbErr?.message || tmdbErr
        );
        // do NOT return here; fall through to local DB response
      }
    }

    // Fallback: read from local Mongo `Movie` collection
    const skip = (page - 1) * limit;
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
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

/* ----------------- Reviews endpoints ----------------- */

/**
 * Replacement safe GET /movies/:id/reviews
 * - Prefer ObjectId match if id looks like one.
 * - For non-ObjectId ids (TMDB numeric/string) attempt a combined query but guard against CastError.
 */
router.get("/:id/reviews", async (req, res) => {
  try {
    const rawId = String(req.params.id || "");
    // prefer exact ObjectId match when the id looks like one
    if (isObjectIdString(rawId)) {
      const reviews = await Review.find({ movie: rawId })
        .sort({ createdAt: -1 })
        .populate("user", "name username")
        .lean();
      return res.json(reviews);
    }

    // non-ObjectId (likely TMDB id or other string). Try to query movieId first.
    // We attempt a combined query but guard against Mongoose ObjectId casting errors.
    const byMovieId = { movieId: rawId };

    // Try a combined query (movieId OR movie as string) but protect against CastError
    // (some older records may have stored movie as a plain string — defensive).
    let reviews;
    try {
      reviews = await Review.find({ $or: [byMovieId, { movie: rawId }] })
        .sort({ createdAt: -1 })
        .populate("user", "name username")
        .lean();
    } catch (err) {
      // If Mongoose attempted to cast `movie: rawId` and failed, fall back to movieId-only
      if (err && err.name === "CastError" && /ObjectId/.test(err.message)) {
        console.warn(
          "Reviews query: CastError when querying `movie` field, falling back to movieId-only",
          rawId
        );
        reviews = await Review.find(byMovieId)
          .sort({ createdAt: -1 })
          .populate("user", "name username")
          .lean();
      } else {
        throw err;
      }
    }

    return res.json(reviews);
  } catch (err) {
    console.error("GET /movies/:id/reviews error:", err);
    return res.status(400).json({ message: err?.message || "Bad request" });
  }
});

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
