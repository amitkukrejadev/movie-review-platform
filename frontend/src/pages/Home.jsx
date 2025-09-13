// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { fetchMovies } from "../utils/api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies()
      .then((data) => {
        setMovies(data.movies || []);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map((m) => (
          <MovieCard key={m._id} movie={m} />
        ))}
      </div>
    </div>
  );
}
