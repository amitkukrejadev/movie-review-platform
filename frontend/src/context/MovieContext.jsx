// frontend/src/context/MovieContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { fetchMovies, fetchMovieById, fetchTMDBPoster } from "../utils/api";

export const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [moviesByPage, setMoviesByPage] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getMovie = useCallback(
    (id) =>
      Object.values(moviesByPage)
        .flat()
        .find((m) => m._id === id),
    [moviesByPage]
  );

  const fetchMovie = useCallback(async (id) => {
    setLoading(true);
    try {
      const movie = await fetchMovieById(id);
      const posterUrl = await fetchTMDBPoster(movie.title, movie.year);
      return { ...movie, posterUrl };
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPage = useCallback(
    async (pageNum) => {
      if (moviesByPage[pageNum]) return;
      setLoading(true);
      try {
        const { movies } = await fetchMovies(pageNum);
        const moviesWithPosters = await Promise.all(
          movies.map(async (movie) => ({
            ...movie,
            posterUrl: await fetchTMDBPoster(movie.title, movie.year),
          }))
        );
        setMoviesByPage((prev) => ({ ...prev, [pageNum]: moviesWithPosters }));
      } finally {
        setLoading(false);
      }
    },
    [moviesByPage]
  );

  return (
    <MovieContext.Provider
      value={{
        moviesByPage,
        page,
        setPage,
        loading,
        loadPage,
        getMovie,
        fetchMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  return useContext(MovieContext);
}
