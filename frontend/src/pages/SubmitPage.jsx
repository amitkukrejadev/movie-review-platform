// frontend/src/pages/SubmitPage.jsx
import React from "react";
import RequestMovieForm from "../components/RequestMovieForm";

export default function SubmitPage() {
  return (
    <section className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request a Movie</h1>
      <p className="text-sm text-slate-500 mb-4">
        Suggest a movie and optionally add a rating or notes.
      </p>
      <RequestMovieForm />
    </section>
  );
}
