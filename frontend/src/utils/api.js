// frontend/src/utils/api.js
// central API helpers for app backend + optional TMDB lookup
const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

// TMDB: read API key from environment (frontend .env). It's optional — functions will no-op if not set.
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"; // good general size for posters

export async function fetchMovies(page = 1) {
  const res = await fetch(`${API}/api/movies?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function fetchMovieById(id) {
  const res = await fetch(`${API}/api/movies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
}

/**
 * Try to find a poster on TMDB by title (+ optional year).
 * - Returns a full poster URL (TMDB image) or null if not found / not configured.
 * - This does a client-side request directly to TMDB (read-only).
 */
export async function fetchTMDBPoster(title, year) {
  if (!TMDB_API_KEY) return null;

  try {
    const q = encodeURIComponent(title);
    const yearParam = year ? `&year=${encodeURIComponent(year)}` : "";
    const url = `${TMDB_SEARCH_URL}?api_key=${TMDB_API_KEY}&query=${q}${yearParam}`;

    const res = await fetch(url);
    if (!res.ok) {
      // TMDB may rate-limit; return null on any non-OK
      return null;
    }
    const data = await res.json();
    if (!data || !Array.isArray(data.results) || data.results.length === 0)
      return null;

    // Prefer exact-ish matches: find first with a poster_path
    const best = data.results.find((r) => r.poster_path) || data.results[0];
    if (best && best.poster_path) {
      return `${TMDB_IMAGE_BASE}${best.poster_path}`;
    }
    return null;
  } catch (err) {
    // fail safe: return null (don't throw — UI will fallback)
    console.warn("TMDB poster lookup failed:", err?.message || err);
    return null;
  }
}
