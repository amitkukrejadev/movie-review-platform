// frontend/src/components/MovieCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={
            movie.posterUrl
              ? `https://image.tmdb.org/t/p/w500${movie.posterUrl}`
              : "/posters/placeholder-300x450.png"
          }
          alt={`Poster for ${movie.title}`}
          onError={(e) => {
            e.target.src = "/posters/placeholder-300x450.png";
          }}
          className="w-full h-auto object-cover aspect-[2/3]"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600">
            {movie.year || "Unknown year"}
          </p>
          <p className="text-sm text-gray-500">
            {movie.numReviews || 0} reviews
          </p>
        </div>
      </div>
    </Link>
  );
}
