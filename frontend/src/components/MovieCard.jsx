// frontend/src/components/MovieCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const {
    id,
    title,
    posterUrl = "/posters/placeholder-300x450.png",
    releaseYear,
    genre = [],
  } = movie;

  return (
    <Link
      to={`/movies/${id}`}
      className="block rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-150 bg-white"
      aria-label={`Open ${title}`}
    >
      <div className="aspect-[2/3] w-full bg-gray-100 overflow-hidden rounded-t">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3">
        <h3 className="text-lg md:text-xl font-semibold leading-tight">
          {title}
        </h3>
        <div className="text-sm text-slate-500 mt-1">
          {releaseYear ? releaseYear : "—"} ·{" "}
          {(Array.isArray(genre) ? genre.slice(0, 2) : []).join(", ")}
        </div>
      </div>
    </Link>
  );
}
