// frontend/src/utils/tmdb.js
const TMDB_BASE =
  import.meta.env.VITE_TMDB_BASE || "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const IMAGE_BASE =
  import.meta.env.VITE_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";
const PLACEHOLDER =
  import.meta.env.VITE_PLACEHOLDER_URL || "/posters/placeholder-300x450.png";

if (!TMDB_KEY) {
  console.warn("VITE_TMDB_KEY is missing. Add it to frontend/.env");
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export async function fetchTrendingPage(page = 1) {
  const url = `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&page=${page}`;
  return fetchJson(url);
}

export async function discoverMoviesByYear(year, page = 1) {
  const url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&primary_release_year=${year}&sort_by=popularity.desc&page=${page}`;
  return fetchJson(url);
}

export async function fetchMovieDetails(id) {
  const details = await fetchJson(
    `${TMDB_BASE}/movie/${id}?api_key=${TMDB_KEY}`
  );
  const credits = await fetchJson(
    `${TMDB_BASE}/movie/${id}/credits?api_key=${TMDB_KEY}`
  );
  const videos = await fetchJson(
    `${TMDB_BASE}/movie/${id}/videos?api_key=${TMDB_KEY}`
  );
  return { details, credits, videos };
}

export function mapResults(results = []) {
  return (results || []).map((r) => ({
    id: String(r.id),
    title: r.title || r.name || "Untitled",
    posterUrl: r.poster_path
      ? `${IMAGE_BASE}/w342${r.poster_path}`
      : PLACEHOLDER,
    releaseYear: r.release_date
      ? new Date(r.release_date).getFullYear()
      : r.release_year || "",
    genre: r.genre_ids || r.genres || [],
    overview: r.overview || "",
    raw: r,
  }));
}
