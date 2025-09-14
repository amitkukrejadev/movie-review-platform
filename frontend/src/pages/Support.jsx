import React from "react";

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Support</h1>
        <p className="text-slate-600 mt-2">
          Get help, report bugs, or ask questions.
        </p>
      </header>

      <section className="space-y-6 text-slate-700">
        <p>
          For support or questions about the project, please email{" "}
          <a href="mailto:thenameisamitkukreja@gmail.com">
            thenameisamitkukreja@gmail.com
          </a>
          .
        </p>

        <div className="rounded-md bg-slate-50 p-4 border">
          <h3 className="font-semibold">Quick troubleshooting</h3>
          <ul className="list-disc pl-6 mt-2">
            <li>
              Check that the backend is running: <code>/movies</code> endpoint
              returns data.
            </li>
            <li>Confirm TMDB_KEY is set in backend env when using TMDB.</li>
            <li>If using Mongo local fallback, ensure seeded data exists.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
