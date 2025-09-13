// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-screen-md mx-auto text-center py-24">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-slate-600 mb-6">Page not found.</p>
      <Link
        to="/"
        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        Go home
      </Link>
    </div>
  );
}
