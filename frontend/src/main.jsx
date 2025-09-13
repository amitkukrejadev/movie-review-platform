import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthProvider";
import { MovieProvider } from "./context/MovieContext"; // <-- match above

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
