// frontend/src/pages/Home.jsx
import React, { useContext } from "react";
import MovieContext from "../context/MovieContextValue"; // read context default
import MovieCard from "../components/MovieCard";

export default function Home() {
  const { movies = [], loading } = useContext(MovieContext);

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold">Trending Movies</h1>
      </header>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading movies…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((m) => (
            <MovieCard key={m.id || m._id || m.title} movie={m} />
          ))}
        </div>
      )}
    </section>
  );
}
