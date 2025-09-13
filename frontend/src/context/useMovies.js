// frontend/src/context/useMovies.js
import { useEffect, useState, useCallback } from "react";

const TMDB_BASE =
  import.meta.env.VITE_TMDB_BASE || "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const IMAGE_BASE =
  import.meta.env.VITE_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";
const PLACEHOLDER =
  import.meta.env.VITE_PLACEHOLDER_URL || "/posters/placeholder-300x450.png";

export function useMovies({
  initialPage = 1,
  limit = 20,
  initialSearch = "",
} = {}) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(initialSearch);

  const loadPage = useCallback(
    async (p = 1, opts = {}) => {
      const q = typeof opts.search === "string" ? opts.search : search || "";
      setLoading(true);
      setError(null);
      try {
        const base = (import.meta.env.VITE_API_URL || "").trim();
        let url;
        if (base) {
          // backend expects /movies?page=&limit=&search=
          const b = base.replace(/\/$/, "");
          const params = new URLSearchParams({
            page: String(p),
            limit: String(limit),
          });
          if (q) params.set("search", q);
          url = `${b}/movies?${params.toString()}`;
        } else {
          // direct TMDB client-side request (fallback)
          if (!TMDB_KEY) throw new Error("Missing VITE_TMDB_KEY in .env");
          if (q) {
            url = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
              q
            )}&page=${p}`;
          } else {
            url = `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&page=${p}`;
          }
        }

        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) {
          let msg = `status ${res.status}`;
          try {
            const txt = await res.text();
            const maybe = JSON.parse(txt);
            if (maybe && maybe.message) msg = `${msg} - ${maybe.message}`;
            else if (txt) msg = `${msg} - ${txt}`;
          } catch {
            // ignore parse errors
          }
          throw new Error(msg);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setMovies(data.slice(0, limit));
          setTotalPages(1);
          setPage(p);
        } else if (data.results) {
          const mapped = (data.results || []).map((r) => ({
            id: String(r.id),
            title: r.title || r.name || "Untitled",
            posterUrl: r.poster_path
              ? `${IMAGE_BASE}/w342${r.poster_path}`
              : PLACEHOLDER,
            releaseYear: r.release_date
              ? new Date(r.release_date).getFullYear()
              : "",
            genre: r.genre_ids || [],
            runtime: r.runtime || null,
            overview: r.overview || "",
          }));
          setMovies(mapped.slice(0, limit));
          setTotalPages(data.total_pages || 1);
          setPage(p);
        } else if (data.movies) {
          setMovies((data.movies || []).slice(0, limit));
          setTotalPages(
            data.totalPages || Math.ceil((data.total || 0) / limit) || 1
          );
          setPage(data.page || p);
        } else {
          setMovies([]);
          setTotalPages(1);
          setPage(p);
        }
      } catch (err) {
        const msg = err?.message || String(err);
        if (msg.includes("Failed to fetch")) {
          setError(
            `Network error: ${msg} — is the backend running and CORS allowed?`
          );
        } else {
          setError(msg);
        }
        console.error("useMovies.loadPage error:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit, search]
  );

  // initial load when hook mounts or initialPage/initialSearch changes
  useEffect(() => {
    setSearch(initialSearch || "");
    loadPage(initialPage, { search: initialSearch || "" });
  }, [initialPage, initialSearch, loadPage]);

  return {
    movies,
    page,
    totalPages,
    loadPage,
    loading,
    error,
    search,
    setSearch,
  };
}
