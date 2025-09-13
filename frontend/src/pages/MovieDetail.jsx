// frontend/src/pages/MovieDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById } from "../utils/api";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchMovieById(id)
      .then((data) => setMovie(data.movie || data))
      .catch(console.error);
  }, [id]);

  if (!movie) return <p>Loading movie...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">{movie.title}</h1>
      <p className="text-gray-600">{movie.description}</p>
      {/* expand with reviews, add review form, etc. */}
    </div>
  );
}
