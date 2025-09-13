// frontend/src/utils/api.js
const API = import.meta.env.VITE_API_URL || "http://localhost:5001";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";
const TMDB_READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN || "";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export async function fetchMovies(page = 1) {
  const res = await fetch(`${API}/movies?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function fetchMovieById(id) {
  const res = await fetch(`${API}/movies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
}

export async function fetchTMDBPoster(title, year) {
  if (!TMDB_API_KEY || !TMDB_READ_TOKEN) return null;
  try {
    const q = encodeURIComponent(title);
    const yearParam = year ? `&year=${encodeURIComponent(year)}` : "";
    const url = `${TMDB_SEARCH_URL}?query=${q}${yearParam}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TMDB_READ_TOKEN}` },
    });
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
