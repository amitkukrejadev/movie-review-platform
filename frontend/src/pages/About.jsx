import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">About Movie Reviews</h1>
        <p className="text-slate-600 mt-2">
          Who we are and what we believe in.
        </p>
      </header>

      <section className="prose max-w-none">
        <p>
          Movie Reviews is a lightweight demo platform for browsing movies,
          reading reviews, and leaving ratings. We combine a friendly UI with a
          simple API layer (local DB + TMDB fallback) so you can focus on the UX
          and features.
        </p>

        <h3>Mission</h3>
        <p>
          To build a clean, accessible movie browsing experience that helps
          people discover films and share opinions. This demo is intentionally
          simple but extensible — add auth, watchlists, recommendations, and
          more.
        </p>

        <h3>Contact</h3>
        <p>
          For product questions, feedback, or bug reports email{" "}
          <a href="mailto:thenameisamitkukreja@gmail.com">
            thenameisamitkukreja@gmail.com
          </a>
          .
        </p>

        <p>
          Back to <Link to="/">Home</Link>.
        </p>
      </section>
    </div>
  );
}
