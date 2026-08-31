# Citizen Complaint Portal

A full-stack, responsive web application for citizens to report local civic issues and municipal officers to manage and resolve them.

## Tech Stack

**Frontend:** React 18 + Vite, Tailwind CSS, React Router DOM, Axios, react-hot-toast, Lucide React
**Backend:** Node.js + Express, MongoDB + Mongoose, JWT + bcryptjs, json2csv

> **Note on stack:** the spec listed Next.js as an option for the frontend; this build uses
> React + Vite instead (still plain React, same component code) to keep the build fast and
> deployment simple for a hackathon timeline. Swap in Next.js later if you need SSR/SEO —
> the API layer is unchanged either way.

## Features Implemented

- **Auth:** signup (citizen only from the public form), login, JWT, bcrypt password hashing
- **Complaints:** submit, browse (public feed), view details, upvote (one per citizen)
- **My Complaints:** citizen's own complaint list with live status + officer remarks
- **Officer Dashboard:** table of all complaints, search/filter by category/area/status/priority
- **Status updates:** officer sets Pending / In Progress / Resolved + remark, timestamped
- **Duplicate detection:** before submitting, checks for existing Pending/In Progress complaints
  in the same category + area, and offers to upvote instead
- **Priority scoring:** `score = upvotes × 2 + daysSinceCreated`, computed server-side on every
  fetch (Low <5, Medium 5–15, High 16–30, Critical >30) — shown as a badge everywhere
- **Citizen feedback:** after a complaint is marked Resolved, the citizen is prompted to rate
  it (1–5 stars + comment); officers see an aggregate satisfaction score
- **CSV export:** officers can download the currently-filtered complaint list as a `.csv`
- **Officer briefing card:** a computed-stats summary (total, new today, overdue, resolved this
  week, hotspots, satisfaction) shown at the top of the Officer Dashboard

### Intentionally deferred
- **AI-generated briefing (Claude API):** per your choice, this is *not* wired up yet. The
  `/api/officer/stats` endpoint already returns the exact stats an AI prompt would need
  (see `server/controllers/statsController.js`) — the dashboard currently renders those stats
  directly as a plain-English sentence instead of calling an LLM. To add real AI generation
  later: send that JSON to the Claude API with a system prompt like *"You are a concise
  government operations assistant. Summarize these complaint stats in 3–5 plain English
  sentences for an officer."* and swap the rendered text for the response.
- **Photo upload (Multer/Cloudinary):** the `imageUrl` field exists on the Complaint model and
  is used if present; the form currently accepts a photo *URL* rather than a file upload.
- **Map view, Socket.io live updates, Chart.js analytics:** stretch goals, not built.

## Folder Structure

```
complaint-portal/
├── server/
│   ├── config/db.js
│   ├── controllers/       (auth, complaint, stats)
│   ├── middleware/        (auth, error handling)
│   ├── models/             (User, Complaint)
│   ├── routes/             (auth, complaints, officer stats)
│   ├── utils/              (JWT, priority scoring)
│   ├── seed.js
│   └── server.js
└── client/
    └── src/
        ├── components/     (layout, ui, complaints)
        ├── pages/
        ├── context/AuthContext.jsx
        ├── services/       (API layer)
        └── routes/ProtectedRoute.jsx
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string (the original spec
  recommends Atlas so judges can view live data without local setup)

### 1. Backend

```bash
cd server
cp .env.example .env      # edit MONGO_URI / JWT_SECRET
npm install
npm run seed                # populates demo users + complaints
npm run dev                  # http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env       # points to the backend API
npm install
npm run dev                  # http://localhost:5173
```

### Demo Credentials (after `npm run seed`)

| Role    | Email                   | Password    |
|---------|--------------------------|--------------|
| Officer | officer@portal.gov       | password123  |
| Officer | officer2@portal.gov      | password123  |
| Citizen | citizen1@example.com     | password123  |

(Officer accounts are seeded directly — per the spec, there's no public officer signup.)

## API Routes

```
POST   /api/auth/signup                 Citizen signup
POST   /api/auth/login                  Login (citizen or officer)
GET    /api/auth/me                     Current user

POST   /api/complaints                  Create complaint                      (citizen)
GET    /api/complaints                  List/browse/duplicate-check (filters) (public)
GET    /api/complaints/mine             Citizen's own complaints              (citizen)
GET    /api/complaints/:id              Complaint details                     (public)
PATCH  /api/complaints/:id/upvote       Upvote                                (citizen)
PATCH  /api/complaints/:id/status       Update status + remark                (officer)
PATCH  /api/complaints/:id/feedback     Submit satisfaction rating            (citizen, owner)
GET    /api/complaints/export           CSV export (respects filters)         (officer)

GET    /api/officer/stats               Dashboard briefing stats              (officer)
```

Query params on `GET /api/complaints`: `search`, `category`, `area`, `status`
(comma-separated for multiple, e.g. `Pending,In Progress`), `priority`, `sort`, `page`, `limit`.

Duplicate detection uses the same endpoint:
`GET /api/complaints?category=Road&area=Sector%20G-9&status=Pending,In Progress`

## Deployment

The spec marks deployment as mandatory. Suggested path:
- **Backend:** Render or Railway — set `MONGO_URI` (Atlas), `JWT_SECRET`, `CLIENT_URL` env vars
- **Frontend:** Vercel or Netlify — set `VITE_API_URL` to the deployed backend's `/api` URL
- **Database:** MongoDB Atlas free tier (so judges can view live data)

After deploying, run the seed script once against the Atlas URI (locally, pointed at the
production `MONGO_URI`) to populate demo data, or seed manually through the signup/login flow.
