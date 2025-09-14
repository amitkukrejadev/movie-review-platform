# 🎬 Movie Review Platform

**Author:** [Amit Kukreja](https://www.linkedin.com/in/amitkukrejadev)  
**Live Demo:** [movie-review-platform-64a3.onrender.com](https://movie-review-platform-64a3.onrender.com)

---

## 📌 Overview
A small **movie discovery & review app** built with:

- **Backend:** Node.js, Express, Mongoose  
- **Frontend:** React, Vite, Tailwind CSS  
- **Movie Data:** TMDB API  

This repository contains **both frontend and backend** in one project:

- `/backend` → Node.js + Express API  
- `/frontend` → React + Vite app (served from backend in production)

---

## 🚀 Quick Start (Local Development)

**Prerequisites:**  
- Node.js `v18+`  
- npm  
- MongoDB  

### 1️⃣ Clone & Setup
```bash
# clone repo
git clone <repo-url>
cd movie-review-platform
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install

# configure environment
cp .env.example .env  
# add your keys (MONGODB_URI, TMDB_KEY, JWT_SECRET, PORT)

# run backend
npm run dev
3️⃣ Frontend Setup (separate terminal)
bash
Copy code
cd ../frontend
npm install
npm run dev
Frontend Env Note:

Local dev defaults to http://localhost:5001

In production, set VITE_API_URL=/ so the frontend uses relative API paths.

☁️ Deployment (Render Notes)
This project is deployed on Render (single web service serving backend + static frontend).

Key Render Settings:

Build Command:

bash
Copy code
npm install --prefix frontend && npm run build --prefix frontend
Start Command:

bash
Copy code
node backend/server.js
Environment Variables:
MONGODB_URI, TMDB_KEY, JWT_SECRET, PORT
(use Render secrets)

Frontend: Set VITE_API_URL=/ in Render env

📝 Known Issues / TODO
🔒 Login & user management for review ownership (planned)

📱 Mobile header tweaks & layout container polish (stage 3)

🌐 Minor SEO & manifest improvements (done: basic meta + manifest)

🔍 Smoke Tests (Deployed)
Run these to validate deployment:

bash
Copy code
# homepage (movies)
curl -s 'https://movie-review-platform-64a3.onrender.com/movies?page=1&limit=1' | jq .

# sample reviews
curl -s 'https://movie-review-platform-64a3.onrender.com/movies/1078605/reviews' | jq .
📬 Contact
👤 Amit Kukreja
🔗 LinkedIn @amitkukrejadev