// frontend/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6">
        {/* Grid: stacks on mobile, row on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Left: logo + name */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white font-bold text-lg">
              MR
            </div>
            <div className="text-center md:text-left">
              <div className="font-semibold">Movie Reviews</div>
            </div>
          </div>

          {/* Middle: links (center on mobile) */}
          <div className="flex justify-center">
            <div className="flex gap-8 text-sm text-slate-600">
              <div>
                <div className="font-medium">Company</div>
                <ul className="mt-2 space-y-1">
                  <li>
                    <Link to="/about" className="hover:underline">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="hover:underline">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-medium">Support</div>
                <ul className="mt-2 space-y-1">
                  <li>
                    <Link to="/privacy" className="hover:underline">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:underline">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: copyright center on mobile, right on md+ */}
          <div className="flex justify-center md:justify-end text-sm text-slate-500">
            © {new Date().getFullYear()} Amit Kukreja — All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
