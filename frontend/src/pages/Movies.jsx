// frontend/src/pages/Movies.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MoviesList from "../components/MoviesList";

const TMDB_BASE =
  import.meta.env.VITE_TMDB_BASE || "https://api.themoviedb.org/3";
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const IMAGE_BASE =
  import.meta.env.VITE_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p";
const PLACEHOLDER =
  import.meta.env.VITE_PLACEHOLDER_URL || "/posters/placeholder-300x450.png";

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get("search") || "").trim();
  const page = Number(searchParams.get("page") || 1);
  const year = searchParams.get("year") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        let url;
        // 1) search query -> TMDB search endpoint (relevance)
        if (q) {
          url = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
            q
          )}&page=${page}&include_adult=false`;
        } else if (year) {
          // 2) if year filter chosen -> discover (allows grabbing lots by year)
          // sort by popularity and avoid very-low-vote results
          url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&page=${page}&primary_release_year=${encodeURIComponent(
            year
          )}&sort_by=popularity.desc&vote_count.gte=5`;
        } else {
          // 3) default -> trending
          url = `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&page=${page}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDB ${res.status}`);
        const data = await res.json();
        const mapped = (data.results || []).map((r) => ({
          id: String(r.id),
          title: r.title || r.name || "Untitled",
          posterUrl: r.poster_path
            ? `${IMAGE_BASE}/w342${r.poster_path}`
            : PLACEHOLDER,
          releaseYear: r.release_date
            ? new Date(r.release_date).getFullYear()
            : r.release_year || "",
          genre: r.genre_ids || [],
          overview: r.overview || "",
          popularity: r.popularity || 0,
        }));

        if (!mounted) return;
        setMovies(mapped);
        // TMDB responses provide total_pages for search/discover/trending
        setTotalPages(Math.max(1, data.total_pages || 1));
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // small delay to avoid flicker when navigating quickly (optional)
    const t = setTimeout(load, 50);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [q, page, year]);

  // helpers to update query params for pagination/filter
  function goToPage(p) {
    const next = Object.fromEntries([...searchParams]);
    next.page = String(p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setYearFilter(y) {
    const next = Object.fromEntries([...searchParams]);
    if (y) next.year = String(y);
    else delete next.year;
    // reset page when changing filter
    next.page = "1";
    setSearchParams(next);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Movies</h1>
          {q ? (
            <p className="text-slate-600">Results for “{q}”</p>
          ) : year ? (
            <p className="text-slate-600">Movies released in {year}</p>
          ) : (
            <p className="text-slate-600">
              Browse trending movies — filter by year or genre.
            </p>
          )}
        </div>

        {/* Year filter quick UI */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Year</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={year}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="">All</option>
            {/* recent years; add more if you want */}
            {Array.from({ length: 8 }).map((_, idx) => {
              const y = new Date().getFullYear() - idx;
              return (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              );
            })}
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>

          {/* quick link to discover by popular this year */}
          <Link
            to="/movies"
            onClick={() => {
              // clear search and year for "trending"
              setSearchParams({});
            }}
            className="text-sm text-blue-600 underline"
          >
            Trending
          </Link>
        </div>
      </header>

      <MoviesList
        movies={movies}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        onPage={(p) => goToPage(p)}
      />
    </div>
  );
}
