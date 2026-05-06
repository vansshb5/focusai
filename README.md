# FocusAI 🧠

> An AI-powered productivity and task management system that understands natural language, prioritizes your work, and helps you stay focused.

![FocusAI](https://img.shields.io/badge/FocusAI-v1.0.0-1D9E75?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3-FF6B35?style=for-the-badge)

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | [focusai-amber.vercel.app](https://focusai-amber.vercel.app) |
| Backend API | [focusai-api.onrender.com](https://focusai-api.onrender.com) |

---

## ✨ Features

- **🤖 AI Task Parsing** — Type naturally: *"Finish DSA by Friday, high priority, 2 hours"* → AI extracts title, deadline, priority, and estimated time automatically
- **📊 Priority Scoring** — Smart engine scores tasks 0–100 based on priority level, deadline urgency, and estimated time
- **📅 Daily Planner** — AI selects and schedules your top 5 tasks for the day
- **🔍 Daily Review** — End-of-day AI summary with productivity score and suggestions
- **⏱️ Pomodoro Timer** — 25-minute focus sessions with progress bar and work/break cycles
- **🎯 Focus Mode** — Full-screen distraction-free page with task switcher (`/focus`)
- **🎤 Voice Input** — Speak your task using Web Speech API — auto-submits on transcript
- **🔔 Toast Notifications** — Loading/success/error feedback for every action
- **🔽 Task Filtering** — Filter by ALL / PENDING / DONE / HIGH priority
- **⚠️ Deadline Badges** — OVERDUE / DUE TODAY / TOMORROW / Xd left
- **📈 Analytics Charts** — 7-day activity bar chart + priority breakdown with completion rates
- **🔐 Authentication** — JWT-based register/login, all tasks scoped per user
- **🎨 Glassmorphism UI** — Dark theme, aurora background, glass cards, glitch text, animated counters, glowing task cards
- **🗂️ Collapsible Sidebar** — Icon-only when collapsed, expands with smooth Framer Motion animation

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | UI dashboard |
| Routing | React Router v6 | Page navigation |
| Animations | Framer Motion | Transitions + effects |
| Charts | Recharts | Analytics visualization |
| Notifications | React Hot Toast | User feedback |
| Backend | Node.js + Express | API server |
| Database | MongoDB Atlas | Task + user storage |
| AI | Groq API (Llama 3.3-70b) | Task parsing + planning |
| Auth | JWT + bcryptjs | User authentication |
| Deployment | Vercel + Render | Frontend + backend hosting |

---

## 📁 Project Structure

```
focusai/
├── backend/
│   ├── app.js                    # Express app entry point
│   ├── .env                      # Environment variables
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Task.js               # Task schema (scoped to user)
│   │   └── Plan.js               # Plan schema
│   ├── controllers/
│   │   ├── authController.js     # Register, login, getMe
│   │   ├── taskController.js     # CRUD + stats
│   │   └── aiController.js       # AI parse, plan, review
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protect middleware
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   ├── grokService.js        # Groq API calls
│   │   └── plannerService.js     # Daily plan generator
│   └── utils/
│       └── priorityEngine.js     # Priority score calculator
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Main app + routing
    │   ├── main.jsx              # Entry + providers
    │   ├── index.css             # Global styles
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state management
    │   ├── services/
    │   │   └── api.js            # Axios instance + endpoints
    │   ├── pages/
    │   │   ├── AuthPage.jsx      # Login + register
    │   │   └── Focus.jsx         # Full-screen focus mode
    │   └── components/
    │       ├── TaskInput.jsx     # Text + voice input
    │       ├── TaskList.jsx      # Filtered task list
    │       ├── Planner.jsx       # AI daily schedule
    │       ├── Analytics.jsx     # Charts + stats
    │       ├── VoiceButton.jsx   # Web Speech API mic
    │       └── ui/
    │           ├── Aurora.jsx        # Animated canvas bg
    │           ├── Sidebar.jsx       # Collapsible nav
    │           ├── GlassCard.jsx     # Glassmorphism card
    │           ├── GlitchText.jsx    # Scramble animation
    │           ├── CountUp.jsx       # Animated counter
    │           └── TaskCard.jsx      # Animated task item
    └── vercel.json               # SPA rewrite rule
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/focusai.git
cd focusai
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/focusai
GROQ_API_KEY=gsk_your_groq_key_here
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the app

From the root `focusai/` directory:

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173) concurrently.

Open [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Reference

### Auth Routes (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create new account |
| POST | `/auth/login` | Sign in |
| GET | `/auth/me` | Get current user |

### Task Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all user tasks |
| POST | `/tasks` | Create task manually |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/tasks/stats` | Get analytics data |

### AI Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/parse-task` | Parse natural language → task |
| GET | `/ai/daily-plan` | Get AI-scheduled top 5 tasks |
| GET | `/ai/daily-review` | Get productivity summary |

---

## 🧠 How AI Task Parsing Works

```
User types: "Study DSA graphs tomorrow high priority 2 hours"
                        ↓
              Groq API (Llama 3.3-70b)
                        ↓
         Extracts structured JSON:
         {
           "title": "Study DSA graphs",
           "deadline": "2026-04-01T00:00:00.000Z",
           "priority": "high",
           "estimatedTime": 2
         }
                        ↓
         Priority engine scores it: 90/100
         (high priority +50, deadline tomorrow +40)
                        ↓
              Saved to MongoDB
                        ↓
         Appears in task list + daily plan
```

---

## ⚙️ Priority Score Formula

```
Score = priority_points + deadline_points + time_points

priority:  high=50,  medium=25, low=0
deadline:  ≤1 day=40, ≤3 days=25, ≤7 days=10
time:      ≤1 hour=10

Max score: 100
```

---

## 🌍 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set Root Directory: `frontend`
4. Add env var: `VITE_API_URL=https://your-render-url.onrender.com`
5. Deploy

### Backend → Render

1. New Web Service on [render.com](https://render.com)
2. Set Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all 4 environment variables
6. Deploy

---

## 🔮 Roadmap

- [ ] Google Calendar sync
- [ ] Dark / light mode toggle
- [ ] Mobile responsive layout
- [ ] Goal decomposition (break big goals into subtasks)
- [ ] Recurring tasks
- [ ] Team workspaces
- [ ] Email reminders
- [ ] PWA support

---

## 🐛 Known Issues & Fixes

| Issue | Fix |
|-------|-----|
| `grok-beta` model not found | Changed to `llama-3.3-70b-versatile` on Groq |
| `next is not a function` in bcryptjs | Moved password hashing to controller, removed mongoose pre-save hook |
| React hooks called after early returns | Moved all hooks above conditional returns |
| JWT 401 on all requests | Moved axios interceptor to `api` instance instead of global axios |
| MongoDB Atlas connection refused | Set IP whitelist to `0.0.0.0/0` in Atlas Network Access |
| CORS blocking Vercel frontend | Added dynamic origin function with `.vercel.app` wildcard check |
| Express wildcard `*` error | Changed `app.options("*")` to `app.options("/{*path}")` |

---

## 👤 Author

**Vanssh Bhargav**

---

## 📄 License

MIT License — feel free to use and modify for your own projects.
