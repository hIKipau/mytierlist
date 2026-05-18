# MYTIERLIST

A social web app for creating and sharing tier lists. Users can register, log in, publish tier lists, and browse a community feed of posts and media.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Bundler | Vite 5 |
| Auth backend | [auth-service](https://github.com/hIKipau/auth-service) (Go, JWT RS256, PostgreSQL) |

## Features

- **Feed** — community posts, tier lists, and media
- **Create tier list** — from scratch, from a template, or by importing JSON
- **Auth** — register and log in via the auth-service; session persists in `localStorage`
- **User search** — find users by login (stub, pending full backend)

## Project structure

```
src/
├── components/
│   ├── CreateTierlistPanel/   # right panel — tier list creation actions
│   ├── FeedPanel/             # center panel — community feed
│   ├── Footer/
│   ├── Header/                # brand + auth buttons / logged-in user display
│   ├── Modal/                 # login & signup modals
│   └── NavigationPanel/       # left panel — nav links + user search
└── pages/
    └── HomePage/
        ├── api.ts             # auth API calls + localStorage token management
        ├── constants.ts       # auth endpoint URLs
        └── types.ts
```

## Running locally

### 1. Start the auth-service

The frontend requires [auth-service](https://github.com/hIKipau/auth-service) running on `localhost:8080`.

```bash
git clone https://github.com/hIKipau/auth-service
cd auth-service

# generate RSA keys (required once)
mkdir -p keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem

# start with Docker Compose (includes PostgreSQL + migrations)
docker compose up --build
```

The service will be available at `http://localhost:8080`. Swagger docs: `http://localhost:8080/swagger/index.html`.

### 2. Start the frontend

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies all `/api/v1/*` requests to `localhost:8080`, so no CORS config is needed.

## Auth flow

| Action | Endpoint | Payload |
|---|---|---|
| Register | `POST /api/v1/auth/register` | `{ login, password }` |
| Log in | `POST /api/v1/auth/login` | `{ login, password }` |
| Log out | `POST /api/v1/auth/logout` | `{ refresh_token }` |

On success the service returns `{ access_token, refresh_token }`. Both tokens are stored in `localStorage` and cleared on logout.

## Available scripts

```bash
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build → dist/
npm run preview  # serve the production build locally
```
