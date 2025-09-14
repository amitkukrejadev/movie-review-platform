// frontend/src/components/MobileMenu.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MobileMenu({ open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => open && onClose()}
        aria-hidden={!open}
      >
        <div
          className="w-full h-full bg-black"
          style={{ opacity: open ? 0.4 : 0 }}
        />
      </div>

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className={`fixed right-0 top-0 h-full w-11/12 max-w-xs bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586L15.95 2.636a1 1 0 011.414 1.414L11.414 10l5.95 5.95a1 1 0 01-1.414 1.414L10 11.414l-5.95 5.95A1 1 0 012.636 15.95L8.586 10 2.636 4.05A1 1 0 014.05 2.636L10 8.586z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-auto">
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
                  to="/company"
                  onClick={onClose}
                  className="block px-2 py-2"
                >
                  Company
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  onClick={onClose}
                  className="block px-2 py-2"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  onClick={onClose}
                  className="block px-2 py-2"
                >
                  Support
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

          <div className="mt-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (open) onClose();
                  navigate("/login");
                }}
                className="w-full px-3 py-2 rounded border"
              >
                Login
              </button>
              <button
                onClick={() => {
                  if (open) onClose();
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
