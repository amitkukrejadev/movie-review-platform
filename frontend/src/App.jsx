// src/App.jsx
import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-xl w-full p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-2">
          Tailwind test — Movie Reviews
        </h1>
        <p className="text-gray-600 mb-4">
          If this is styled, Tailwind is working ✅
        </p>
        <p className="text-gray-400">Lorem ipsum dolor sit amet.</p>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Tailwind Button
        </button>
      </div>
    </div>
  );
}
