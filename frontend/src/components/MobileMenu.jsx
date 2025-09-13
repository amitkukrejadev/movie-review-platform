// frontend/src/components/MobileMenu.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MobileMenu({ open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className="fixed right-0 top-0 h-full w-11/12 max-w-xs bg-white z-50 shadow-xl transform transition-transform"
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white font-bold">
                MR
              </div>
              <div className="font-semibold">Movie Reviews</div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          {/* nav links */}
          <nav className="flex-1">
            <ul className="space-y-3 text-lg">
              <li>
                <Link to="/" onClick={onClose} className="block px-2 py-2">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/movies"
                  onClick={onClose}
                  className="block px-2 py-2"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/submit"
                  onClick={onClose}
                  className="block px-2 py-2"
                >
                  Request
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={onClose} className="block px-2 py-2">
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  onClick={onClose}
                  className="block px-2 py-2"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="block px-2 py-2"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* auth */}
          <div className="mt-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  navigate("/login");
                }}
                className="w-full px-3 py-2 rounded border"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate("/register");
                }}
                className="w-full px-3 py-2 rounded bg-blue-600 text-white"
              >
                Register
              </button>
            </div>

            <div className="mt-4 text-sm text-slate-500">
              <div>© {new Date().getFullYear()} Amit Kukreja</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
