# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build at http://localhost:4173
```

No linting or tests are configured.

## Architecture

**Dual-page SPA** with routing handled in [main.jsx](main.jsx): `/admin` renders `AdminPanel`, all other paths render `LaMORKS`.

### Public Website — [LaMORKS.jsx](LaMORKS.jsx)
Single large component (~1117 lines) rendering the full marketing site: nav, hero, portfolio grid, services, partners carousel, contact form. Portfolio data is fetched live from Firebase Firestore via a real-time listener.

### Admin Panel — [AdminPanel.jsx](AdminPanel.jsx)
Password-protected (env var `VITE_ADMIN_PASSWORD`) dashboard for full CRUD on portfolio items. Uploads images to Firebase Storage and syncs with Firestore in real time.

### Firebase — [firebase.js](firebase.js)
Wraps all Firestore and Storage operations: real-time portfolio subscription, add/update/delete items, image upload/delete. All Firebase config comes from `VITE_FIREBASE_*` env vars.

### Email API — [api/send-email.js](api/send-email.js)
Vercel serverless function. Validates and sanitizes contact form submissions, then sends HTML email via Resend using `RESEND_API_KEY`.

## Environment Variables

Required in `.env` (never commit):
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_PASSWORD` — admin panel access
- `RESEND_API_KEY` — used only in the serverless function (no `VITE_` prefix, not exposed to client)

## Deployment

Deployed on Vercel. [vercel.json](vercel.json) rewrites all non-`/api` routes to `/index.html` for SPA routing. The `api/` directory is auto-deployed as Vercel Functions. Secrets are stored in Vercel environment variables.
