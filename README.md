# 🎬 Movie Review Platform

A full-stack movie review platform built with **React (Vite)** on the frontend and **Node.js (Express + MongoDB)** on the backend.  
Users can browse movies, search/filter, view details, read/write reviews, and manage their watchlist.

---

## 🚀 Features

### Frontend (React)
- Responsive UI with **TailwindCSS**
- **Pages**:
  - Home page (featured & trending movies)
  - Movie listing with search & filters
  - Individual movie page (details, cast, trailers, reviews)
  - User profile page (review history & watchlist)
  - Login & Register with authentication
- **Components**:
  - Movie cards, review form, review list
  - Navbar, mobile menu, footer
- State management via **React Context**
- Integrated with **TMDB API** for posters and details
- Error handling + loading states

### Backend (Node.js + Express)
- **RESTful API**:
  - `GET /movies` — list movies (pagination & filtering)
  - `GET /movies/:id` — get movie details
  - `POST /movies/:id/reviews` — add a review
  - `GET /movies/:id/reviews` — fetch reviews
  - `GET /users/:id` — get user profile
  - `PUT /users/:id` — update profile
  - `GET /users/:id/watchlist` — get watchlist
  - `POST /users/:id/watchlist` — add movie
  - `DELETE /users/:id/watchlist/:movieId` — remove movie
- JWT authentication (login/register)
- MongoDB models for **Movies, Users, Reviews**
- Average rating calculation
- Error handling + validation
- TMDB API integration for trending/search

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), React Router, Context API, TailwindCSS  
- **Backend:** Node.js, Express, Mongoose, JWT, Bcrypt  
- **Database:** MongoDB Atlas  
- **External API:** TMDB (The Movie Database)  

---

## ⚙️ Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas or local MongoDB
- TMDB API key (from [themoviedb.org](https://themoviedb.org))

### Install & Run

Clone repo:
```bash
git clone https://github.com/amitkukrejadev/movie-review-platform.git
cd movie-review-platform