// frontend/src/context/MovieContext.jsx
import React, { createContext, useState } from "react";

const MovieContext = createContext();

export default function MovieProvider({ children }) {
  const [moviesByPage, setMoviesByPage] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadPage = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies?page=${pageNum}`
      );
      if (!res.ok) throw new Error("Failed to fetch movies");
      const data = await res.json();
      setMoviesByPage((prev) => ({ ...prev, [pageNum]: data.movies }));
      setPage(pageNum);
    } finally {
      setLoading(false);
    }
  };

  const getMovie = (id) => {
    for (const page in moviesByPage) {
      const movie = moviesByPage[page].find((m) => m._id === id);
      if (movie) return movie;
    }
    return null;
  };

  const fetchMovie = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${id}`);
    if (!res.ok) throw new Error("Failed to fetch movie");
    return res.json();
  };

  return (
    <MovieContext.Provider
      value={{ moviesByPage, page, loadPage, loading, getMovie, fetchMovie }}
    >
      {children}
    </MovieContext.Provider>
  );
}
