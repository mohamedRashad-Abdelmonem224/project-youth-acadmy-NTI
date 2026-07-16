# ⚽ Youth Academy — Egypt Young Talents Platform

A full-stack web platform for discovering, submitting, and reviewing young football talents.
Players submit their stats and highlight videos, scouts/coaches browse and rank talent, 
and admins review and approve submissions 
 all secured with JWT authentication and role-based authorization.
Built as project of an NTI training track meanstack
## ✨ Features
1-JWT authentication** — register, login, and session persistence
2-Role-based authorization** — `admin`, `coach`, `scout`, `player`, `viewer`, each with different capabilities
3-Player profiles** — stats (goals, assists, matches, injuries), rating history, profile image, highlight video
4-Talent discovery** — Top 10 ranking, browse all players, filter by position
5-Player submission flow** — players submit their own stats/photo/video, which stay `pending` until an admin approves or rejects them
6-Admin review dashboard** — approve/reject pending player submissions
7-Player development analysis** — auto-generated trend (improving / stable / declining) based on a player's rating across their last 3 season
🛠 Tech Stack
Backend
- Node.js, Express 5
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for auth
- `bcryptjs` for password hashing
- `multer` for image uploads
Frontend
- Angular 22 (standalone components, signals, new `@if`/`@for` control flow)
- Chart.js for rating & development-analysis charts
- Plain SCSS (no UI framework) — custom red/black theme
## 📁 Project Structure
project-youth-acadmy-NTI/
├── youth-academy-backend/     # Express + MongoDB REST API
│   ├── config/                # DB connection
│   ├── controllers/           # auth, admin, player logic
│   ├── middleware/             # JWT auth, role authorization, multer upload
│   ├── models/                 # User & Player Mongoose schemas
│   ├── routes/                  # /auth, /admin, /players
│   └── scripts/                  # DB seed script
└── youth-academy-frontend/     # Angular 22 SPA
    └── src/app/
        ├── core/                # models, services, guards, interceptors
        ├── features/            # auth-gate, header, players, admin
        └── shared/utils/         # video embed + player insights helpers

### Prerequisites
- Node.js 22.22.3+ (or 24.15+/26+)
- A MongoDB instance (local or MongoDB Atlas)

### 1) Backend setup

```bash
cd youth-academy-backend
npm install
```
Create a `.env` file in `youth-academy-backend/`:
```env
MONGO_URI=mongodb://localhost:27017      # or your MongoDB Atlas connection string
DB_NAME=youth-academy
PORT=3500
JWT_SECRET=replace-with-a-long-random-secret
```
Run the API:
```bash
npm run dev        # nodemon, auto-restarts on changes
# or
npm start
You should see `MongoDB connected` and `server run on port 3500` in the console.
### 2) Frontend setup

```bash
cd youth-academy-frontend
npm install
npm start
``
The app runs at `http://localhost:4200`. It talks to the API base URL configured in `src/environments/environment.ts` — update this if your backend runs on a different host/port:

```ts
export const environment = {
  production: false,
  apiOrigin: 'http://localhost:3500',
  apiUrl: 'http://localhost:3500/api',
};

## 🔑 Environment Variables (backend)

| Variable      | Description                                  |
|---------------|-----------------------------------------------|
| `MONGO_URI`   | MongoDB connection string                     |
| `DB_NAME`     | Database name                                 |
| `PORT`        | Port the API listens on                       |
| `JWT_SECRET`  | Secret used to sign/verify JWTs                |

## 👥 Roles & Permissions

| Role     | Can do                                                              |
|----------|-----------------------------------------------------------------------|
| `viewer` | Browse players, view profiles                                        |
| `coach`  | Same as viewer                                                        |
| `scout`  | Same as viewer                                                        |
| `player` | Submit their own stats/photo/video for review                        |
| `admin`  | Approve/reject pending player submissions, edit/delete any player   |

## 📡 API Reference
### Auth — `/api/auth`

| Method | Endpoint    | Auth | Description                  |
|--------|-------------|------|-------------------------------|
| POST   | `/register` | –    | Create a new account          |
| POST   | `/login`    | –    | Log in with email + password  |
| GET    | `/me`       | JWT  | Get the current logged-in user |

### Players — `/api/players`

| Method | Endpoint      | Auth              | Description                       |
|--------|---------------|--------------------|-------------------------------------|
| GET    | `/`           | –                  | List all approved players          |
| GET    | `/:id`        | –                  | Get a single player by ID           |
| POST   | `/`           | JWT + role `player`| Submit a new player entry (pending) |
| PATCH  | `/:id`        | JWT + role `admin` | Update a player                     |
| DELETE | `/:id`        | JWT + role `admin` | Delete a player                     |

### Admin — `/api/admin/players`

| Method | Endpoint          | Auth               | Description                  |
|--------|-------------------|---------------------|--------------------------------|
| GET    | `/pending`        | JWT + role `admin`  | List players awaiting review  |
| PATCH  | `/:id/approve`    | JWT + role `admin`  | Approve a pending player       |
| PATCH  | `/:id/reject`     | JWT + role `admin`  | Reject a pending player        |

## 📊 Player Development Analysis
Each player's `rating` array tracks 5 seasons of performance. The frontend derives a **last-3-seasons trend** from it — improving 📈, stable ⚖, or declining 📉 — with the percentage change, shown as a chart on the player's profile page. This is computed client-side; the backend currently stores cumulative career stats only (not per-season breakdowns).
## ⚠️ Known Limitations
- `register` currently accepts any `role` value sent by the client, including `admin` — there's no restriction on self-elevating to admin at signup. This is a known gap intended to be locked down before production use.
- No rate limiting on login/registration.
- No upload size limit on player images.
## 🗺 Possible Improvements
- Restrict which roles can be self-assigned at registration
- Rate limiting on auth endpoints
- Per-season stats tracking for more accurate development analysis
- Refresh tokens / token revocation
## 👤 Author
Mohamed Rashad Abdelmonem
NTI Training project
