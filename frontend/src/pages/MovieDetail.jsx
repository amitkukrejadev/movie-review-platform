// frontend/src/pages/MovieDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

export default function MovieDetail() {
  const { id } = useParams();
  const { getMovie, fetchMovie } = useMovies();
  const [movie, setMovie] = useState(() => getMovie(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function ensure() {
      if (!movie) {
        try {
          const fetched = await fetchMovie(id);
          if (mounted) setMovie(fetched);
        } catch (err) {
          if (mounted) setError(err.message || "Failed to load movie");
          console.error("fetchMovie failed:", err.message || err);
        }
      }
    }
    ensure();
    return () => {
      mounted = false;
    };
  }, [id, movie, fetchMovie]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!movie) return <p className="text-gray-500">Loading movie...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img
            src={movie.posterUrl || "/posters/placeholder-300x450.png"}
            alt={`Poster for ${movie.title}`}
            onError={(e) => {
              if (e.target.src && !e.target.src.startsWith("/posters/")) {
                e.target.src = `/posters/${(movie.title || movie._id)
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}-300x450.png`;
                return;
              }
              e.target.src = "/posters/placeholder-300x450.png";
            }}
            className="w-full h-auto rounded-lg object-cover aspect-[2/3]"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {movie.genre} {movie.year ? `• ${movie.year}` : ""}{" "}
            {movie.director ? `— Directed by ${movie.director}` : ""}
          </p>
          <p className="text-gray-700 mb-4">{movie.description}</p>
          <section className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Reviews</h2>
            <ReviewList movieId={movie._id} />
            <ReviewForm movieId={movie._id} />
          </section>
        </div>
      </div>
    </div>
  );
}
