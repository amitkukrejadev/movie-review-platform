// frontend/src/pages/MovieDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMovies } from "../context/useMovies";

export default function MovieDetail() {
  const { id } = useParams();
  const { getMovie, fetchMovie, loading, error } = useMovies();
  const [movie, setMovie] = useState(() => getMovie(id));

  useEffect(() => {
    let mounted = true;

    async function ensure() {
      const cached = getMovie(id);
      if (cached) {
        if (mounted) setMovie(cached);
        return;
      }
      const fetched = await fetchMovie(id);
      if (mounted) setMovie(fetched);
    }

    ensure().catch(console.error);

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading && !movie) return <p>Loading movie...</p>;
  if (error && !movie)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        <strong>Error:</strong> {error}
      </div>
    );

  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 flex-shrink-0">
          <img
            src={movie.posterUrl}
            alt={`Poster for ${movie.title}`}
            className="w-full h-auto rounded shadow"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="text-sm text-gray-500">
            {movie.genre} • {movie.year} • Directed by {movie.director}
          </p>

          <div className="mt-4 text-gray-700">{movie.description}</div>

          <div className="mt-4">
            <strong>Cast:</strong>
            <ul className="list-disc list-inside">
              {(movie.cast || []).map((c, i) => (
                <li key={i}>
                  {c.name}{" "}
                  {c.role ? (
                    <span className="text-sm text-gray-500">as {c.role}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* placeholder: reviews and add review form */}
      <div>
        <h2 className="text-lg font-semibold">Reviews</h2>
        <p className="text-sm text-gray-500">
          (Reviews and review form will be shown here.)
        </p>
      </div>
    </div>
  );
}
