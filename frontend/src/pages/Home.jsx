// frontend/src/pages/Home.jsx
import React, { useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { useMovies } from "../context/useMovies";
import { useSearchParams} from "react-router-dom";
export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") || "1");

  // call hook with initialPage
  const { movies, page, totalPages, loadPage, loading, error } = useMovies({
    initialPage: pageParam,
    limit: 20,
  });

  // when URL page changes, load that page
  useEffect(() => {
    if (pageParam && pageParam !== page) {
      loadPage(pageParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam]);

  function gotoPage(p) {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setSearchParams({ page: String(p) }, { replace: false });
    // loadPage will trigger via effect (or we can call directly)
    loadPage(p);
    // optionally scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold">Trending Movies</h1>
        <p className="text-slate-600 mt-2">
          A curated list for your demo — responsive, searchable, and ready to
          extend.
        </p>
      </header>

      {/* controls row (kept simple; you can wire search/filters here) */}  
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading movies…</div>
      ) : error ? (
        <div className="py-20 text-center text-red-600">Error: {error}</div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center text-slate-500">No movies found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((m) => (
              <MovieCard
                key={m.id}
                movie={{
                  id: m.id,
                  title: m.title,
                  posterUrl: m.posterUrl,
                  releaseYear: m.releaseYear,
                  genre: m.genre,
                  runtime: m.runtime,
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => gotoPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Prev
            </button>

            {/* simple numeric pages (shows +-2 around current) */}
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
              // compute page number to display around current
              const windowHalf = 3;
              let start = Math.max(1, page - windowHalf);
              let end = Math.min(totalPages, start + 6);
              if (end - start < 6) start = Math.max(1, end - 6);
              const pnum = start + idx;
              if (pnum > end) return null;
              return (
                <button
                  key={pnum}
                  onClick={() => gotoPage(pnum)}
                  className={`px-3 py-1 rounded ${
                    pnum === page ? "bg-blue-600 text-white" : "border"
                  }`}
                >
                  {pnum}
                </button>
              );
            })}

            <button
              onClick={() => gotoPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="mt-2 text-center text-sm text-slate-500">
            Page {page} of {totalPages}
          </div>
        </>
      )}
    </section>
  );
}
