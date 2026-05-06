# ◈ NewsPulse — MERN Hacker News Aggregator

> A full-stack MERN application that scrapes, stores, and serves top Hacker News stories with JWT authentication and bookmark management.

![Stack](https://img.shields.io/badge/Stack-MERN-orange)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Features

- **Live Scraper** — Fetches top 10 stories from Hacker News on server start and via API trigger
- **JWT Authentication** — Secure register/login with token-based auth
- **Story Feed** — All stories sorted by points (descending), with pagination
- **Bookmark System** — Toggle bookmarks per-story, persisted in MongoDB, protected route
- **React Context API** — Auth state managed globally across the app
- **Clean UI** — Dark theme, loading states, toast notifications, skeleton loaders

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) + bcryptjs |
| Scraper | Axios + Cheerio |

---

## 📁 Project Structure

```
newspulse/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   └── storyController.js  # CRUD + scrape trigger + bookmark
│   ├── middleware/
│   │   └── auth.js             # JWT protect middleware
│   ├── models/
│   │   ├── User.js             # User schema with bookmarks[]
│   │   └── Story.js            # Story schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── stories.js          # /api/stories/*
│   │   └── scrape.js           # /api/scrape
│   ├── scraper/
│   │   └── hnScraper.js        # Hacker News cheerio scraper
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── StoryCard.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Bookmarks.js
    │   ├── services/
    │   │   └── api.js           # Axios instance + all API calls
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/newspulse.git
cd newspulse
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#-environment-variables) below).

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:5000` and **automatically scrapes Hacker News** on boot.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Start the frontend:

```bash
npm start
```

The app opens at `http://localhost:3000`.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/newspulse` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_secret_here` |
| `JWT_EXPIRE` | JWT expiry duration | `7d` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and get JWT | No |
| `GET` | `/api/auth/me` | Get current user + bookmarks | ✅ Yes |

**Register / Login Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Story Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/stories` | Get all stories (sorted by points) | No |
| `GET` | `/api/stories?page=1&limit=10` | Paginated stories | No |
| `GET` | `/api/stories/:id` | Get single story | No |
| `POST` | `/api/stories/:id/bookmark` | Toggle bookmark | ✅ Yes |

---

### Scraper Endpoint

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/scrape` | Trigger manual scrape | No |

---

## 🔖 Authentication Flow

1. User registers → password hashed with `bcryptjs`
2. Server returns JWT token
3. Frontend stores token in `localStorage`
4. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
5. Protected routes verify token via `protect` middleware

---

## 🕷 Scraper Logic

The scraper (`backend/scraper/hnScraper.js`):

1. Fetches HTML from `https://news.ycombinator.com` via Axios
2. Parses DOM with Cheerio (`.athing` selectors)
3. Extracts: title, URL, points, author, posted time, HN story ID
4. Upserts stories into MongoDB (avoids duplicates using `hnId`)
5. Runs automatically on server start
6. Can be manually triggered via `POST /api/scrape`

---

## 📦 Running Both Together (Concurrently)

Install `concurrently` in the root:

```bash
npm init -y
npm install concurrently
```

Add to root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
  }
}
```

Then run:

```bash
npm run dev
```

---

## 🚢 Deployment

### Backend → [Render](https://render.com) or [Railway](https://railway.app)

1. Push backend to GitHub
2. Connect repo on Render/Railway
3. Set environment variables in dashboard
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend → [Vercel](https://vercel.com)

1. Push frontend to GitHub
2. Import on Vercel
3. Set `REACT_APP_API_URL` to your deployed backend URL
4. Deploy

---

## 🧪 Sample API Responses

**GET /api/stories**
```json
{
  "success": true,
  "count": 10,
  "total": 10,
  "page": 1,
  "totalPages": 1,
  "stories": [
    {
      "_id": "...",
      "title": "Show HN: I built X",
      "url": "https://example.com",
      "points": 342,
      "author": "username",
      "postedAt": "3 hours ago",
      "hnId": "12345678"
    }
  ]
}
```

**POST /api/auth/login**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "bookmarks": []
  }
}
```

---

## 📝 Commit History Convention

```
feat: initial project structure
feat: add MongoDB models (User, Story)
feat: implement JWT authentication
feat: build HN scraper with cheerio
feat: add story CRUD endpoints
feat: implement bookmark toggle
feat: setup React app with Context API
feat: build StoryCard component
feat: add Login and Register pages
feat: implement protected Bookmarks page
feat: add pagination support
fix: handle scraper edge cases
style: polish dark theme UI
docs: add README
```

---

## 👨‍💻 Author

Built as a MERN stack assignment submission. 

---

*NewsPulse — Powered by Hacker News data, built with MERN.*
