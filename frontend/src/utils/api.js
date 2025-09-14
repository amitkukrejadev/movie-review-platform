// frontend/src/utils/api.js
// Normalizes API base so:
// - in dev you can keep VITE_API_URL=http://localhost:5001
// - in production set VITE_API_URL=/ (or leave empty) and the client will call same-origin /movies...
const rawApi = import.meta.env.VITE_API_URL ?? "";
export const API_BASE = (() => {
  const s = rawApi.trim();
  if (!s || s === "/") return ""; // relative => same origin
  // keep full origins like http:// or https://
  if (s.startsWith("http://") || s.startsWith("https://")) {
    return s.endsWith("/") ? s.slice(0, -1) : s;
  }
  // handle other forms, strip trailing slash
  return s.endsWith("/") ? s.slice(0, -1) : s;
})();

// helper to build URLs (path should start with '/')
function buildUrl(path) {
  return `${API_BASE}${path}`;
}

// TMDB config
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN || "";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const TMDB_IMAGE_BASE =
  import.meta.env.VITE_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p/w500";

export async function fetchMovies(page = 1, limit = 20) {
  const res = await fetch(buildUrl(`/movies?page=${page}&limit=${limit}`));
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch movies: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchMovieById(id) {
  const res = await fetch(buildUrl(`/movies/${id}`));
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch movie ${id}: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchTMDBPoster(title, year) {
  if (!TMDB_API_KEY && !TMDB_READ_TOKEN) return null;
  try {
    const q = encodeURIComponent(title);
    const yearParam = year ? `&year=${encodeURIComponent(year)}` : "";
    const url = `${TMDB_SEARCH_URL}?query=${q}${yearParam}`;
    const headers = TMDB_READ_TOKEN
      ? { Authorization: `Bearer ${TMDB_READ_TOKEN}` }
      : { Authorization: `Bearer ${TMDB_API_KEY}` }; // fallback, if you used key instead of read token
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.results?.length) return null;
    const best = data.results.find((r) => r.poster_path) || data.results[0];
    return best?.poster_path ? `${TMDB_IMAGE_BASE}${best.poster_path}` : null;
  } catch (err) {
    console.warn("TMDB poster lookup failed:", err?.message || err);
    return null;
  }
}
