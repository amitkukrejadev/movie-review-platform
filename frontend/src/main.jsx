// frontend/src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthProvider";
import { MovieProvider } from "./context/MovieContext"; // <-- match above

// --- BEGIN: small runtime head fixes (title + favicon) ---
const APP_TITLE = "Movie Reviews"; // tab title text
document.title = APP_TITLE;

// Ensure there's a favicon link and point it at /favicon.ico (or /vite.svg if you prefer)
(function ensureFavicon() {
  const desired = "/favicon.ico"; // <- if you deleted vite.svg, keep this as favicon.ico
  let link = document.querySelector(
    'link[rel="icon"], link[rel="shortcut icon"]'
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  if (link.getAttribute("href") !== desired) {
    link.setAttribute("href", desired);
  }
})();
// --- END head fixes ---

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MovieProvider>
          <App />
        </MovieProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
