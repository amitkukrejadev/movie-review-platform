// frontend/src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  // defensive: ensure search isn't prefilled from elsewhere
  useEffect(() => {
    setQ("");
  }, []);

  function submitSearch(term) {
    const t = (term || "").trim();
    if (t) {
      navigate(`/movies?search=${encodeURIComponent(t)}`);
    } else {
      navigate("/movies");
    }
    setSearchOpen(false);
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    submitSearch(q);
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        {/* Mobile: left search icon */}
        <div className="flex items-center md:hidden w-8">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Open search"
            className="p-2 rounded hover:bg-slate-100"
            title="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
              />
            </svg>
          </button>
        </div>

        {/* Left area: logo + nav (desktop) */}
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white font-bold text-lg">
              MR
            </div>
            <span className="hidden md:inline-block text-2xl font-semibold">
              Movie Reviews
            </span>
          </Link>

          {/* desktop nav immediately to right of logo; added left margin to separate logo & links */}
          <nav className="hidden md:flex md:items-center md:gap-6 ml-6">
            <Link
              to="/"
              className="text-base md:text-lg font-medium px-3 py-1 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-base md:text-lg font-medium px-3 py-1 hover:text-blue-600"
            >
              Movies
            </Link>
            <Link
              to="/submit"
              className="text-base md:text-lg font-medium px-3 py-1 hover:text-blue-600"
            >
              Request
            </Link>
            <Link
              to="/contact"
              className="text-base md:text-lg font-medium px-3 py-1 hover:text-blue-600"
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="text-base md:text-lg font-medium px-3 py-1 hover:text-blue-600"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Desktop: search + auth on the right */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <form onSubmit={onSearchSubmit} className="flex">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies"
              className="w-72 text-sm md:text-base px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Search movies"
            />
          </form>

          <div className="flex items-center gap-3 ml-4">
            <Link to="/login" className="text-sm px-3 py-1">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Mobile: right menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded hover:bg-slate-100"
            title="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
              <input
                autoFocus
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search movies"
                className="w-full px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Search movies"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-md"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
  