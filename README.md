# 🔗 LinkNest

**Personal Link Management System with Telegram Bot Integration**

A full-stack web application for storing, categorizing, searching, and filtering links — with a conversational Telegram bot for saving and retrieving links on the go.

---

## Description

LinkNest is a personal bookmark manager designed to solve the problem of scattered links across browsers, chats, and notes. It provides a clean dark-themed dashboard where you can organize links under custom categories, search by keyword, and filter by category. An integrated Telegram bot lets you save links through a simple conversational flow — just send a URL and the bot guides you through categorizing and titling it.

**Key highlights:**

- **Public dashboard** — Anyone can view and search saved links without logging in
- **Admin mode** — Optional login to add, edit, and delete links via the web UI
- **Dynamic categories** — No hardcoded list; categories are created organically as you add links
- **Conversational Telegram bot** — Send a URL → bot asks for category → asks for title → saves automatically
- **Dark theme** — Modern UI built with TailwindCSS

---

## Tech Stack

| Layer    | Technology                                |
|----------|-------------------------------------------|
| Frontend | React 18, TailwindCSS 3, Axios, Vite 6   |
| Backend  | Node.js, Express.js, Mongoose, JWT        |
| Database | MongoDB (local or Atlas)                  |
| Bot      | node-telegram-bot-api (Telegram Bot API)  |

---

## Project Structure

```
linknest/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Admin login / JWT generation
│   │   └── linkController.js     # CRUD for links + dynamic categories
│   ├── middlewares/
│   │   └── authMiddleware.js     # JWT verification guard
│   ├── models/
│   │   ├── User.js               # Admin user model (email + bcrypt password)
│   │   └── Link.js               # Link model (title, url, category, tags)
│   ├── routes/
│   │   ├── authRoutes.js         # POST /api/auth/login
│   │   └── linkRoutes.js         # CRUD routes + GET /api/links/categories
│   ├── telegram/
│   │   └── bot.js                # Conversational Telegram bot
│   ├── server.js                 # Express entry point
│   ├── seed.js                   # Admin user seeder
│   ├── .env                      # Environment variables
│   ├── .env.example              # Template for .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddLinkModal.jsx  # Add/Edit link form with custom category input
│   │   │   ├── CategoryFilter.jsx# Dropdown filter fetched from API
│   │   │   ├── LinkCard.jsx      # Individual link card (admin: edit/delete)
│   │   │   └── SearchBar.jsx     # Real-time search input
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx # Main dashboard (public view + admin controls)
│   │   │   └── LoginPage.jsx     # Admin login page
│   │   ├── api.js                # Axios instance + API functions
│   │   ├── App.jsx               # Root component (guest/admin routing)
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Tailwind directives + custom styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Workflow

### How the Application Works

```
┌─────────────────────────────────────────────────────┐
│                     USER                            │
│                                                     │
│  ┌──────────────┐          ┌─────────────────────┐  │
│  │  Web Browser  │          │   Telegram App      │  │
│  └──────┬───────┘          └──────────┬──────────┘  │
│         │                             │              │
└─────────┼─────────────────────────────┼──────────────┘
          │                             │
          ▼                             ▼
┌──────────────────┐      ┌──────────────────────────┐
│  React Frontend  │      │    Telegram Bot           │
│  (Vite dev :3000)│      │    (polling mode)         │
│                  │      │                            │
│  • Dashboard     │      │  1. User sends URL         │
│  • Search/Filter │      │  2. Bot asks category      │
│  • Add/Edit/Del  │      │  3. Bot asks title         │
│  • Admin Login   │      │  4. Saves to MongoDB       │
└────────┬─────────┘      │  5. search | keyword       │
         │                │  6. category | name         │
         │  HTTP / API    └────────────┬───────────────┘
         │                             │
         ▼                             ▼
┌──────────────────────────────────────────────────────┐
│              Express.js Backend (:5000)               │
│                                                       │
│  /api/auth/login        → JWT authentication          │
│  /api/links             → GET (public), POST/PUT/DEL  │
│  /api/links/categories  → GET dynamic category list   │
│  /api/health            → Health check                │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │    MongoDB      │
            │   (linknest db) │
            │                 │
            │  • users        │
            │  • links        │
            └─────────────────┘
```

### Web Dashboard Flow

1. **Visitor opens the app** → Dashboard loads, fetches all links from `GET /api/links` (public)
2. **Search** → Types in the search bar → debounced API call with `?search=keyword`
3. **Filter** → Selects a category from dropdown (categories fetched from `GET /api/links/categories`)
4. **Admin Login** → Clicks "Admin Login" → enters email/password → JWT stored in localStorage
5. **Add Link** → Admin clicks "+ Add Link" → modal opens with title, URL, category (text input with autocomplete from existing categories), and tags
6. **Edit/Delete** → Admin sees edit/delete buttons on each card → inline operations via `PUT` / `DELETE`
7. **Logout** → Clears JWT, returns to guest view

### Telegram Bot Flow

```
User:  https://react.dev/learn
Bot:   📂 What category should this link go under?
       Existing categories:
       • Courses
       • Education
       • Tools
       Type an existing category or a new one:

User:  Education
Bot:   📝 Got it! Category: Education
       Now send me the title for this link:

User:  React Official Docs
Bot:   Link Saved ✅
       Title: React Official Docs
       Category: Education
       URL: https://react.dev/learn
```

**Bot Commands:**

| Command / Input            | Action                              |
|----------------------------|-------------------------------------|
| `/start`                   | Welcome message + instructions      |
| `/help`                    | Detailed help with examples         |
| `/cancel`                  | Cancel current operation             |
| Send any URL               | Starts conversational add flow       |
| `search \| keyword`        | Search links by title               |
| `category \| name`         | List links filtered by category     |

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) URI
- **Telegram Bot Token** — create via [@BotFather](https://t.me/BotFather) on Telegram

---

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/linknest
JWT_SECRET=your_secure_random_secret_here
ADMIN_EMAIL=admin@linknest.com
ADMIN_PASSWORD=admin123
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

Seed the admin user:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`. The Telegram bot starts automatically.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000` and proxies API requests to the backend.

### 3. Telegram Bot Setup

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`, follow prompts to create a bot
3. Copy the token and paste it into `TELEGRAM_BOT_TOKEN` in `.env`
4. Restart the backend — the bot will start polling

---

## API Endpoints

| Method | Endpoint               | Description                  | Auth Required |
|--------|------------------------|------------------------------|---------------|
| POST   | `/api/auth/login`      | Admin login, returns JWT     | No            |
| GET    | `/api/links`           | List links (search/filter)   | No (public)   |
| GET    | `/api/links/categories`| Get all existing categories  | No (public)   |
| POST   | `/api/links`           | Create a new link            | Yes           |
| PUT    | `/api/links/:id`       | Update a link                | Yes           |
| DELETE | `/api/links/:id`       | Delete a link                | Yes           |
| GET    | `/api/health`          | Health check                 | No            |

**Query parameters for `GET /api/links`:**

| Param      | Description                              |
|------------|------------------------------------------|
| `search`   | Partial match on title (case-insensitive)|
| `category` | Exact category filter                    |

Example: `GET /api/links?search=react&category=Education`

---

## Dynamic Categories

Categories are **not hardcoded**. They are created on-the-fly:

- When you save a link (via web or Telegram bot) with a new category name, that category is automatically available everywhere
- The `GET /api/links/categories` endpoint returns all unique categories currently in the database
- The dashboard filter dropdown and Telegram bot suggestions both pull from this list
- The "Add Link" modal uses a text input with autocomplete suggestions — type a new category or pick an existing one

---

## Authentication

- The dashboard is **publicly accessible** — anyone can view, search, and filter links
- **Admin login** is optional and unlocks add/edit/delete functionality
- JWT tokens are valid for **7 days** and stored in `localStorage`
- Passwords are hashed with **bcrypt** (12 salt rounds)

---

## Dark Theme

| Token            | Color     | Usage              |
|------------------|-----------|--------------------|
| Primary BG       | `#0f172a` | Page background    |
| Card BG          | `#1e293b` | Cards, modals      |
| Accent           | `#38bdf8` | Buttons, highlights|
| Text Primary     | `#e2e8f0` | Headings, content  |
| Text Secondary   | `#94a3b8` | Labels, hints      |
| Border           | `#334155` | Dividers, outlines |

---

## Default Admin Credentials

| Field    | Value               |
|----------|---------------------|
| Email    | `admin@linknest.com`|
| Password | `admin123`          |

> Change these in `.env` before deploying to production.

---

## Production Deployment

1. **Build the frontend:**
   ```bash
   cd frontend && npm run build
   ```
2. **Serve** the `dist/` folder via Nginx, Vercel, or any static host
3. **Run the backend** with `npm start` behind a process manager like PM2
4. **Use MongoDB Atlas** for a managed cloud database
5. **Set a strong** `JWT_SECRET` in production
6. **Set** `TELEGRAM_BOT_TOKEN` for the Telegram bot to work
