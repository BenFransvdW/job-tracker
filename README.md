# Job Tracker

A full-stack job application tracking tool built as an experiment with [Claude Code](https://claude.ai/code). Track applications through a kanban-style board, log interviews, and view analytics on your job search progress.

> Built primarily as a hands-on exploration of AI-assisted development with Claude Code and its plugin ecosystem.

## Features

- **Kanban board** — drag-and-drop applications across statuses: Wishlist, Applied, Interviewing, Offer, Rejected, Ghosted
- **Application management** — track company, role, salary range, location, contacts, tags, and follow-up dates
- **Interview tracking** — log interview rounds (phone, video, onsite, take-home, panel) with outcomes
- **Analytics dashboard** — summary stats, application funnel, and timeline charts
- **Auth** — JWT-based authentication with access/refresh token rotation

## Tech Stack

### Client
- React 19 + TypeScript
- Vite + TailwindCSS v4
- TanStack Query (data fetching/caching)
- dnd-kit (drag and drop)
- Recharts (analytics)
- React Router v7

### Server
- Express 5 + TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken) + bcryptjs
- Zod (schema validation)
- Helmet + express-rate-limit (security)

### Shared
- Common TypeScript types, Zod schemas, and constants shared between client and server via npm workspaces

## Project Structure

```
job-tracker/
├── packages/
│   ├── client/       # React SPA
│   ├── server/       # Express API
│   └── shared/       # Shared types, schemas, constants
└── package.json      # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/BenFransvdW/job-tracker.git
cd job-tracker
npm install
```

2. Create `packages/server/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

3. Create `packages/client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Running locally

```bash
npm run dev
```

This starts both the server (port 3000) and client (port 5173) concurrently.

## Deployment

The project is deployed on Vercel:
- **Client** — standard Vite SPA deployment
- **Server** — serverless via `packages/server/api/index.ts`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| GET/POST | `/api/applications` | List / create applications |
| GET/PUT/DELETE | `/api/applications/:id` | Get / update / delete application |
| PUT | `/api/applications/:id/status` | Update application status |
| PUT | `/api/applications/:id/reorder` | Reorder on board |
| GET/POST | `/api/applications/:appId/interviews` | List / create interviews |
| GET/PUT/DELETE | `/api/applications/:appId/interviews/:id` | Get / update / delete interview |
| GET | `/api/stats/summary` | Summary statistics |
| GET | `/api/stats/timeline` | Applications over time |
| GET | `/api/stats/funnel` | Application funnel breakdown |
| GET | `/api/health` | Health check |
