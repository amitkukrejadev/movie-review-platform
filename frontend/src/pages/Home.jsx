// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useMovies } from "../context/MovieContext"; // Fixed import path
import MovieCard from "../components/MovieCard";

export default function Home() {
  const { moviesByPage, page, loadPage, loading } = useMovies();
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPage(1).catch((err) => {
      setError(err?.message || "Failed to load movies");
      console.error("loadPage(1) failed:", err?.message || err);
    });
  }, [loadPage]);

  const movies = moviesByPage[page] || [];
  console.log({ moviesByPage, page, loading, movies, error }); // Debug state

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Movies</h2>
      {loading && movies.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded shadow p-4 animate-pulse min-h-[220px]"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map((m) => (
            <MovieCard key={m._id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}
