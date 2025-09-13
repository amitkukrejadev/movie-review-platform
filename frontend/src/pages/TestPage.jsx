// frontend/src/pages/TestPage.jsx
import React, { useEffect, useState } from "react";

export default function TestPage() {
  const [movies, setMovies] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies`);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return (
    <div className="p-8 bg-yellow-300 min-h-screen">
      <h1 className="text-[100px] font-bold mb-4 text-center text-red-700">
        Test Page — Quick Health Check
      </h1>

      <div className="mb-4">
        <strong>API base:</strong>{" "}
        <code>{import.meta.env.VITE_API_URL || "not set"}</code>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xl">Tailwind test box (should be styled):</p>
        <div className="p-4 border-4 border-black rounded bg-green-400 text-white text-lg">
          If this box looks styled, Tailwind is definitely working 🚀
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Movies from backend</h2>
        {error && <div className="text-red-600">Error fetching: {error}</div>}
        {!movies && !error && <div>Loading...</div>}
        {movies && movies.length === 0 && <div>No movies returned.</div>}
        {movies && movies.length > 0 && (
          <ul className="mt-3 space-y-2">
            {movies.map((m) => (
              <li key={m._id} className="flex items-center gap-3">
                <img
                  src={
                    m.posterUrl ||
                    m.poster ||
                    "/posters/placeholder-300x450.png"
                  }
                  alt={m.title}
                  width="64"
                  height="96"
                  className="object-cover rounded"
                />
                <span>{m.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
