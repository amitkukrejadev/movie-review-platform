import React from "react";
import { Link } from "react-router-dom";

/**
 * MovieCard
 * Simple presentational card with image fallback via onError.
 */
export default function MovieCard({ movie }) {
  const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Poster";

  function handleImgError(e) {
    try {
      if (e?.target?.src !== PLACEHOLDER) {
        e.target.src = PLACEHOLDER;
      }
    } catch {
      // silent
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="w-full h-48 overflow-hidden rounded">
        <img
          src={movie?.posterUrl || PLACEHOLDER}
          alt={`Poster for ${movie?.title || "movie"}`}
          onError={handleImgError}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="mt-2 font-semibold">{movie?.title}</h3>
      <p className="text-sm text-gray-500">
        {movie?.genre || "—"} • {movie?.year || "—"}
      </p>
      <Link
        to={`/movies/${movie?._id}`}
        className="text-indigo-600 text-sm mt-2 inline-block"
      >
        View
      </Link>
    </div>
  );
}
