// frontend/src/components/MoviesList.jsx
import React from "react";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

/**
 * Props:
 * - movies: array
 * - loading: bool
 * - error: string|null
 * - page: number (current)
 * - totalPages: number
 * - onPage(pageNumber) callback
 */
export default function MoviesList({
  movies = [],
  loading = false,
  error = null,
  page = 1,
  totalPages = 1,
  onPage = () => {},
}) {
  return (
    <div>
      {loading ? (
        <div className="py-20 text-center">Loading movies…</div>
      ) : error ? (
        <div className="py-12 text-center text-red-600">Error: {error}</div>
      ) : movies.length === 0 ? (
        <div className="py-12 text-center text-slate-600">No movies found.</div>
      ) : (
        <>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {movies.map((m) => (
              <li key={m.id}>
                <MovieCard movie={m} />
              </li>
            ))}
          </ul>

          {/* Pagination controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded border bg-white disabled:opacity-60"
              >
                Prev
              </button>

              {/* show up to 5 page buttons centered around current */}
              {(() => {
                const res = [];
                const start = Math.max(1, page - 2);
                const end = Math.min(totalPages, start + 4);
                for (let p = start; p <= end; p += 1) {
                  res.push(
                    <button
                      key={p}
                      onClick={() => onPage(p)}
                      className={`px-3 py-1 rounded ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "bg-white border"
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                return res;
              })()}

              <button
                onClick={() => onPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border bg-white disabled:opacity-60"
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
