// frontend/src/components/MovieCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const INLINE_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#374151" font-size="20" font-family="Arial, Helvetica, sans-serif">No Poster</text></svg>`
  );

export default function MovieCard({ movie }) {
  const title = movie?.title || "Untitled";
  const external = movie?.posterUrl || "";
  const localCandidate = `/posters/${slugify(
    movie?.title || movie?._id || "poster"
  )}-300x450.png`;
  const initialSrc = external || localCandidate || INLINE_PLACEHOLDER;

  console.log({ movie, initialSrc }); // Debug poster selection

  const handleImgError = (e) => {
    const cur = e?.target?.getAttribute("src") || "";
    if (cur.startsWith("http") && localCandidate) {
      e.target.src = localCandidate;
      return;
    }
    if (cur === localCandidate && INLINE_PLACEHOLDER) {
      e.target.src = INLINE_PLACEHOLDER;
      return;
    }
    if (cur !== INLINE_PLACEHOLDER) {
      e.target.src = INLINE_PLACEHOLDER;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="w-full overflow-hidden rounded">
        <img
          src={initialSrc}
          alt={`Poster for ${title}`}
          onError={handleImgError}
          className="w-full h-auto rounded object-cover aspect-[2/3]"
          width="300"
          height="450"
        />
      </div>
      <h3 className="mt-2 font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">
        {movie?.genre || ""} {movie?.year ? `• ${movie.year}` : ""}
      </p>
      <Link
        to={`/movies/${movie?._id}`}
        className="text-indigo-600 text-sm mt-2 inline-block hover:underline"
      >
        View
      </Link>
    </div>
  );
}
