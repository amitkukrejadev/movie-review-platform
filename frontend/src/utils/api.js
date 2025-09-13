// frontend/src/utils/api.js
const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
