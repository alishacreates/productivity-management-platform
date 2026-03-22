

# 🚀 Productivity Management Platform

A full-stack web application for managing tasks, habits, focus sessions, goals, and notes — built with **Next.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
productivity-platform/
├── backend/                  # Express + MongoDB API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── dashboardController.js
│   │   ├── taskController.js
│   │   ├── habitController.js
│   │   ├── focusController.js
│   │   ├── goalController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   ├── asyncHandler.js   # Wraps async route handlers
│   │   └── errorHandler.js   # Global error middleware
│   ├── models/
│   │   ├── Task.js
│   │   ├── Habit.js
│   │   ├── FocusSession.js
│   │   ├── Goal.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── taskRoutes.js
│   │   ├── habitRoutes.js
│   │   ├── focusRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── noteRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js             # Entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── frontend/                 # Next.js 14 App Router
    ├── app/
    │   ├── layout.js         # Root layout (fonts, metadata)
    │   ├── globals.css       # Tailwind + custom design tokens
    │   ├── page.js           # Dashboard (/)
    │   ├── tasks/page.js     # Task Management (/tasks)
    │   ├── habits/page.js    # Habit Tracker (/habits)
    │   ├── focus/page.js     # Pomodoro Focus (/focus)
    │   ├── goals/page.js     # Goals (/goals)
    │   └── notes/page.js     # Notes (/notes)
    ├── components/
    │   ├── AppShell.js       # Sidebar + Navbar wrapper
    │   ├── Sidebar.js        # Navigation sidebar
    │   ├── Navbar.js         # Top navbar
    │   ├── StatCard.js       # Dashboard stat card
    │   ├── Modal.js          # Reusable modal dialog
    │   ├── LoadingSpinner.js # Loading indicator
    │   └── EmptyState.js     # Empty state placeholder
    ├── lib/
    │   └── api.js            # Axios API client (all endpoints)
    ├── next.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.local.example
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017  
  _OR_ a MongoDB Atlas connection string

---

## 🛠️ Setup & Installation

### 1. Clone / Download the project

```bash
cd productivity-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Edit .env — set MONGODB_URI if using Atlas

# Start the backend (development)
npm run dev
# → Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create your .env.local file
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the frontend (development)
npm run dev
# → Runs on http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable        | Default                                          | Description              |
|-----------------|--------------------------------------------------|--------------------------|
| `PORT`          | `5000`                                           | Server port              |
| `MONGODB_URI`   | `mongodb://localhost:27017/productivity_platform`| MongoDB connection string |
| `NODE_ENV`      | `development`                                    | Environment mode         |
| `FRONTEND_URL`  | `http://localhost:3000`                          | CORS allowed origin      |

### Frontend (`frontend/.env.local`)

| Variable                | Default                        | Description          |
|-------------------------|--------------------------------|----------------------|
| `NEXT_PUBLIC_API_URL`   | `http://localhost:5000/api`    | Backend API base URL |

---

## 📡 API Endpoints

### Dashboard
| Method | Endpoint         | Description              |
|--------|-----------------|--------------------------|
| GET    | `/api/dashboard` | Overview stats           |

### Tasks
| Method | Endpoint                  | Description         |
|--------|--------------------------|---------------------|
| GET    | `/api/tasks`              | Get all tasks       |
| POST   | `/api/tasks`              | Create task         |
| GET    | `/api/tasks/:id`          | Get single task     |
| PUT    | `/api/tasks/:id`          | Update task         |
| DELETE | `/api/tasks/:id`          | Delete task         |
| PATCH  | `/api/tasks/:id/toggle`   | Toggle status       |

### Habits
| Method | Endpoint                    | Description            |
|--------|----------------------------|------------------------|
| GET    | `/api/habits`               | Get all habits         |
| POST   | `/api/habits`               | Create habit           |
| PUT    | `/api/habits/:id`           | Update habit           |
| DELETE | `/api/habits/:id`           | Delete habit           |
| PATCH  | `/api/habits/:id/complete`  | Toggle today's completion |

### Focus Sessions
| Method | Endpoint         | Description              |
|--------|-----------------|--------------------------|
| GET    | `/api/focus`     | Get sessions + today total |
| POST   | `/api/focus`     | Save session             |
| GET    | `/api/focus/stats` | 7-day stats            |
| DELETE | `/api/focus/:id` | Delete session           |

### Goals
| Method | Endpoint         | Description     |
|--------|-----------------|-----------------|
| GET    | `/api/goals`     | Get all goals   |
| POST   | `/api/goals`     | Create goal     |
| PUT    | `/api/goals/:id` | Update goal     |
| DELETE | `/api/goals/:id` | Delete goal     |

### Notes
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/notes`          | Get all notes        |
| GET    | `/api/notes?search=x` | Search notes         |
| POST   | `/api/notes`          | Create note          |
| PUT    | `/api/notes/:id`      | Update note          |
| DELETE | `/api/notes/:id`      | Delete note          |

---

## 🎯 Features

### Dashboard
- Overview stat cards: tasks completed today, best habit streak, focus time, active goals
- Recent tasks list with priority badges
- Quick habit toggle for today's check-ins

### Task Management
- Create, edit, delete tasks
- Fields: title, description, priority (low/medium/high), deadline, status
- Filter by status and priority
- One-click status toggle

### Habit Tracker
- Add habits with custom colors
- Mark daily completions (toggle)
- Automatic streak calculation via Mongoose pre-save hook
- 7-day visual completion bar per habit
- Daily progress bar

### Focus Mode (Pomodoro)
- 3 preset timers: Focus (25 min), Short Break (5 min), Long Break (15 min)
- Circular SVG progress ring
- Sessions auto-saved on completion
- Partial sessions saved on manual stop
- Session history with today's total

### Goals
- Create goals with title, description, category, deadline
- Track progress via slider (0–100%)
- Quick-set buttons: 0%, 25%, 50%, 75%, 100%
- Auto-complete when progress hits 100%
- Tab filter: Active / Completed / Paused

### Notes
- Colorful sticky-note style cards
- In-place editor with color picker
- Pin/unpin notes (pinned appear first)
- Tag support (comma-separated)
- Full-text search (title + content)
- Masonry-style grid layout

---

## 🏗️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14 (App Router), React 18 |
| Styling    | Tailwind CSS 3, custom CSS vars   |
| HTTP       | Axios                             |
| Backend    | Node.js, Express 4                |
| Database   | MongoDB, Mongoose 8               |
| Dev Tools  | nodemon, dotenv                   |

---

## 💡 Tips

- Run **both** backend and frontend simultaneously in two terminal windows
- Make sure MongoDB is running before starting the backend
- The frontend's `Connected` indicator in the navbar turns green when API calls succeed
- All forms have validation — required fields are marked with `*`

---

## 🐛 Troubleshooting

**Backend won't connect to MongoDB:**  
→ Ensure MongoDB is running: `mongod` or check your Atlas URI in `.env`

**Frontend shows "Failed to load" errors:**  
→ Check that the backend is running on port 5000 and `NEXT_PUBLIC_API_URL` is set correctly

**CORS errors in browser:**  
→ Set `FRONTEND_URL=http://localhost:3000` in backend `.env`
