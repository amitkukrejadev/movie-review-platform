// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useMovies } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const { moviesByPage, page, loadPage, loading } = useMovies();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        await loadPage(page);
      } catch (err) {
        setError(err.message || "Failed to load movies");
      }
    }
    fetch();
  }, [page, loadPage]);

  const movies = moviesByPage[page] || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">
        Movie Reviews
      </h1>
      {loading && (
        <p className="text-gray-500 text-center">Loading movies...</p>
      )}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && !error && !movies.length && (
        <p className="text-gray-500 text-center">No movies found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
