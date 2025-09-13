// frontend/src/components/MovieCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  // fallback placeholder (same host-agnostic placeholder you used in seed)
  const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Poster";

  function handleImgError(e) {
    if (e?.target?.src !== PLACEHOLDER) {
      e.target.src = PLACEHOLDER;
      // optional: remove alt so it doesn't repeat title in some browsers
      // e.target.alt = `Poster not available`;
    }
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="w-full h-48 overflow-hidden rounded">
        <img
          src={movie.posterUrl || PLACEHOLDER}
          alt={`Poster for ${movie.title}`}
          onError={handleImgError}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="mt-2 font-semibold">{movie.title}</h3>
      <p className="text-sm text-gray-500">
        {movie.genre} • {movie.year}
      </p>
      <Link
        to={`/movies/${movie._id}`}
        className="text-indigo-600 text-sm mt-2 inline-block"
      >
        View
      </Link>
    </div>
  );
}
