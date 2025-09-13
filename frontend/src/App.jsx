// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MoviesPage from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TestPage from "./pages/TestPage";
import SubmitPage from "./pages/SubmitPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={<p className="py-20 text-center">404: Page Not Found</p>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
