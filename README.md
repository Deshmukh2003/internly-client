# Internly Client

React/Vite frontend for Internly, a domain-independent internship recommendation platform.

## Stack

- React and JavaScript (no TypeScript)
- Vite
- Bootstrap
- React Router
- React Toastify

## Run locally

```bash
npm install
npm run dev
```

Set `VITE_API_URL` when the API is not running at `http://localhost:8080/api`.

## Current functionality

- Internly branded responsive shell
- Common login page for students and admins
- JWT session storage and logout
- Backend-authorized student/admin route guards
- Student and admin dashboard entry points
- Toast notifications and basic loading-aware login interaction

The client is being developed in vertical slices alongside the separate `internly-server` repository. Authentication UI will expand with registration OTP and password reset flows as those API contracts are implemented.

## Build

```bash
npm run build
```
