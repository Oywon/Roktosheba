# RoktoSheba

Emergency blood donor network for Bangladesh.

## Structure

- `/backend` — Express API, Prisma/PostgreSQL schema, OTP + JWT security, rate limiting, expiration script.
- `/frontend` — React + Vite + TypeScript app, responsive mobile-first UI, typed API client.

## Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Install dependencies:
   - `cd backend`
   - `npm install`
3. Run Prisma generate:
   - `npm run prisma:generate`
4. Create the database schema and seed organizations:
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
5. Start the API:
   - `npm run dev`

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`.
2. Install dependencies:
   - `cd frontend`
   - `npm install`
3. Start the dev app:
   - `npm run dev`

## Environment variables

### `backend/.env`

- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — secret for OTP verification and session tokens.
- `OTP_CODE_TTL_SECONDS` — OTP code expiration in seconds.
- `PORT` — backend port.
- `SMS_PROVIDER_API_KEY` — optional, currently mocked by console log.

### `frontend/.env`

- `VITE_API_BASE_URL` — base URL for the backend API, e.g. `http://localhost:4000/api`.

## Development commands

### Backend

- `npm run dev` — start backend in development.
- `npm run build` — compile TypeScript.
- `npm run start` — run compiled production build.
- `npm run prisma:migrate` — apply migrations.
- `npm run prisma:seed` — seed organization data.
- `npm run expire` — expire stale donors after 90 days.
- `npm test` — run backend tests.

### Frontend

- `npm run dev` — start Vite development server.
- `npm run build` — build the static app.
- `npm run preview` — preview the production build.
- `npm test` — run frontend smoke tests.

## Deployment notes

- Build the frontend and serve its static output from a traditional Node static host or CDN.
- Host the backend separately and set `VITE_API_BASE_URL` to the deployed API URL.
- Use PostgreSQL for production and keep `JWT_SECRET` private.
- Run `npm run expire` as a cron job once per day to silence stale donor listings.
