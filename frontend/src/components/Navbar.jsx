// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Movie Reviews
        </Link>
        <div className="space-x-4 flex items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "underline" : ""}`
            }
          >
            Home
          </NavLink>
          {user ? (
            <>
              <span className="text-sm">{user.username}</span>
              <button onClick={logout} className="text-sm hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "underline" : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `hover:underline ${isActive ? "underline" : ""}`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
