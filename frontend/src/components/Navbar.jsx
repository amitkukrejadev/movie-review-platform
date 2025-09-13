// frontend/src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Movie Reviews
        </Link>
        <div className="space-x-3">
          <Link to="/login" className="text-sm">
            Login
          </Link>
          <Link to="/register" className="text-sm">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
