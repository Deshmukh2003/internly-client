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
- Student registration, email verification OTP, and resend-code screens
- JWT session storage and logout
- Backend-authorized student/admin route guards
- Student and admin dashboard entry points
- Toast notifications and basic loading-aware login interaction
- Shared branded logo asset used in the navigation and authentication surfaces

The client is being developed in vertical slices alongside the separate `internly-server` repository. Password reset will be added in the next authentication slice.

## Build

```bash
npm run build
```
