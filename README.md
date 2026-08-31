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
- Forgot-password and password-reset screens
- Student profile editor with normalized skill add/remove controls
- Resume upload/removal with profile completion indicator
- Student internship browsing with search and domain filters
- Ranked recommendation cards with explainable match scores and internship details
- Internship detail application form and student application tracking
- Notification center with unread counts and read-state controls
- Admin workspace for company listing/creation, internship overview, and application status review
- JWT session storage and logout
- Backend-authorized student/admin route guards
- Student and admin dashboard entry points
- Toast notifications and basic loading-aware login interaction
- Shared branded logo asset used in the navigation and authentication surfaces

The client is being developed in vertical slices alongside the separate `internly-server` repository.

## Frontend structure

- `src/api` — shared HTTP client and API configuration.
- `src/auth` — session persistence helpers.
- `src/components` — reusable branding, auth-card, and route-protection components.
- `src/layouts` — application-wide shell and navigation.
- `src/pages/auth` — login, registration, OTP, and password recovery pages.
- `src/pages/student` — profile, internships, recommendations, applications, and notifications.
- `src/pages/admin` — admin operations workspace.
- `src/pages/admin/components` — focused company, internship, and application-review panels.
- `src/routes` — centralized route definitions.
- `src/assets` — tracked visual assets such as the Internly logo.

`src/main.jsx` is intentionally limited to application bootstrapping and global imports.

## Build

```bash
npm run build
```
