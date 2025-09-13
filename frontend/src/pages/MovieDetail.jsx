import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById } from "../utils/api";

/**
 * MovieDetail
 * Handles both API shapes: either { movie: {...} } or direct movie object.
 */
export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);

    fetchMovieById(id)
      .then((data) => {
        if (!mounted) return;
        // Normalize shape: accept { movie } or raw object
        const resolved =
          data && typeof data === "object"
            ? "movie" in data && data.movie
              ? data.movie
              : data
            : null;
        setMovie(resolved);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e?.message || String(e));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p>Loading movie...</p>;
  if (err) return <p className="text-red-600">Error: {err}</p>;
  if (!movie) return <p>No movie found.</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <div className="flex gap-6">
        <div className="w-40 flex-shrink-0">
          <img
            src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster"}
            alt={`Poster of ${movie.title}`}
            className="w-full h-auto rounded"
            onError={(e) => {
              if (e?.target?.src) e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-600 mb-4">{movie.description}</p>
          <p className="text-sm text-gray-500 mb-2">
            {movie.genre} • {movie.year}
          </p>
          <p className="text-sm text-gray-500">Director: {movie.director || "Unknown"}</p>
        </div>
      </div>

      {/* placeholder for reviews/form */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        <p className="text-gray-500">Reviews will appear here (coming soon).</p>
      </div>
    </div>
  );
}
