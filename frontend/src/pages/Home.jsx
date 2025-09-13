// frontend/src/pages/Home.jsx
import React, { useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { useMovies } from "../context/useMovies"; // <-- updated import

export default function Home() {
  const { moviesByPage, page, totalPages, loading, error, loadPage } =
    useMovies();

  useEffect(() => {
    if (!moviesByPage[1]) loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const movies = moviesByPage[page] || [];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold">Movies</h2>
        <p className="text-sm text-gray-500">
          Browse seeded movies — will fetch more from the API.
        </p>
      </header>

      {loading && movies.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded shadow p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {movies.map((m) => (
              <MovieCard key={m._id} movie={m} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => loadPage(Math.max(1, page - 1))}
                disabled={page <= 1 || loading}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() =>
                  loadPage(Math.min(totalPages || page + 1, page + 1))
                }
                disabled={page >= (totalPages || page) || loading}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
