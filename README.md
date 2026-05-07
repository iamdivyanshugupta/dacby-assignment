## Live Demo

- Frontend: https://dacby-assignment.vercel.app
- Backend: https://dacby-backend.onrender.com


# HackerNews Reader - DACBY Assignment

A full-stack MERN application that scrapes Hacker News stories, displays them with authentication and bookmarking functionality.

## Features

- Auto-scrapes top 10 stories from Hacker News on server start
- Manual scrape trigger via API
- JWT-based authentication (Register/Login)
- Browse stories sorted by points with pagination
- Bookmark/unbookmark stories (authenticated users only)
- Protected Bookmarks page

## Tech Stack

**Frontend:** React, React Router, Axios, Context API  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Scraping:** Cheerio, Axios  
**Auth:** JWT, bcryptjs  

## Project Structure

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

## Environment Variables

Create a `.env` file inside the `backend/` folder:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/dacby-assignment.git
cd dacby-assignment
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`  
MongoDB connects and scraper runs automatically on start.

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user (Protected) |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stories | Get all stories (sorted by points) |
| GET | /api/stories?page=1&limit=10 | Get stories with pagination |
| GET | /api/stories/:id | Get single story |
| POST | /api/stories/:id/bookmark | Toggle bookmark (Protected) |

### Scraper
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/scrape | Manually trigger scraper |

## Bonus Features

- Pagination implemented on stories (page & limit query params)
- Clean and scalable folder structure
- Environment variables via .env
- Meaningful git commit history

