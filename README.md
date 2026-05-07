# 🔥 HNReader — DACBY Assignment

A full-stack MERN application that scrapes Hacker News stories and displays them with a premium dark-mode UI, JWT authentication, and bookmarking functionality.

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://dacby-assignment-umber.vercel.app |
| **Backend API** | https://dacby-assignment-fzq2.onrender.com |

---

## ✨ Features

- 🔄 Auto-scrapes top stories from Hacker News on server start
- 🔧 Manual scrape trigger via API
- 🔐 JWT-based authentication (Register / Login)
- 📰 Browse stories sorted by points with pagination
- 🔖 Bookmark / unbookmark stories (authenticated users only)
- 🛡️ Protected Bookmarks page (requires login)
- 🎨 Premium dark-mode UI with skeleton loaders and animations
- 📱 Fully responsive design (mobile-friendly)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, React Router, Axios, Context API, CSS Variables |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Scraping** | Cheerio, Axios |
| **Auth** | JWT, bcryptjs |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## 📁 Project Structure

```
dacby-assignment/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── scraperController.js
│   │   └── storyController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Story.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── scrapeRoutes.js
│   │   └── storyRoutes.js
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Bookmarks.jsx
        └── App.jsx
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🏃 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/iamdivyanshugupta/dacby-assignment.git
cd dacby-assignment
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`  
MongoDB connects and the scraper runs automatically on start.

### 3. Setup Frontend

Open a **new terminal** in the project root:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login user, returns JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |

### Stories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/stories` | ❌ | Get all stories sorted by points |
| `GET` | `/api/stories?page=1&limit=10` | ❌ | Paginated stories |
| `GET` | `/api/stories/:id` | ❌ | Get single story |
| `POST` | `/api/stories/:id/bookmark` | ✅ | Toggle bookmark |

### Scraper
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/scrape` | ❌ | Manually trigger HN scraper |

---

## 🌟 Highlights

- ✅ Pagination with `page` & `limit` query params
- ✅ Premium dark-mode UI with glassmorphism and micro-animations
- ✅ Skeleton loading states for better UX
- ✅ Mobile-responsive layout
- ✅ Clean and scalable folder structure
- ✅ Environment variables via `.env`
- ✅ CORS configured for cross-origin deployment
- ✅ Meaningful git commit history
