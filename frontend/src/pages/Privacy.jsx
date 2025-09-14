import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
        <p className="text-slate-600 mt-2">
          A short privacy summary for this demo app.
        </p>
      </header>

      <section className="prose max-w-none text-slate-700">
        <p>
          This demo stores minimal information. If you run the app locally and
          enable authentication, the app stores user profiles and reviews in a
          MongoDB database. No analytics, tracking, or advertising is included
          in the demo by default.
        </p>

        <h3>Data</h3>
        <p>
          Reviews submitted are stored in the backend database and displayed on
          the movie pages. Credentials (if using authentication) are stored
          hashed on the server.
        </p>

        <h3>Contact</h3>
        <p>
          If you have privacy concerns, email{" "}
          <a href="mailto:thenameisamitkukreja@gmail.com">
            thenameisamitkukreja@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
