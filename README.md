# Mehfil — Spotify-style frontend for your backend

"Mehfil" is a Hindi/Urdu word for a gathering held for music or poetry — felt like the right name for a
listener + artist platform. A quick vocab pick for you: the app also leans on **convivial** (adjective —
friendly, lively, good-humoured in a social setting), which is the mood the UI is going for.

## What's in this bundle

```
backend/    your original Spotify-clone backend, with 3 fixes + 2 small additions
frontend/   new React + Vite app (no TypeScript, no component libraries, no Redux)
```

## Backend changes (`backend/`)

1. **Bug fix (as requested):** `GET /api/music/` was gated by `authUser`, which only allows role `user` —
   artists got a 403 trying to browse tracks. Switched it to `authMiddleware` so any logged-in user
   (listener or artist) can browse.
2. **Added `GET /api/auth/me`** — there was no way for the frontend to check "who's logged in" after a
   page refresh (the JWT lives in an httpOnly cookie, so JS can't read it directly). This endpoint reads
   the cookie server-side and returns the user. Required for the session to survive a reload.
3. **Added `GET /api/music/albums/:id`** — needed for a real album detail page; returns the album with its
   tracks populated.
4. **CORS + cookie fixes** — added the `cors` package with `credentials: true` (missing before, so a
   frontend on a different origin, like Vercel, couldn't send/receive cookies at all). Also fixed
   `register`'s cookie to use the same `httpOnly`/`sameSite`/`secure` options as `login` (it was setting a
   bare cookie with no options), and made both use `sameSite: 'none', secure: true` in production so the
   cookie survives a cross-site request from Vercel to Render.
5. **Populated `artist` on musics/albums** — was a bare ObjectId before, so the frontend had no way to show
   an artist's name. Now populated with `username`.

Install the new dependency and add env vars:

```bash
cd backend
npm install
```

`.env` needs:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

When you deploy (Render, same as SupportCopilot), set `FRONTEND_URL` to your Vercel URL and `NODE_ENV=production`.

## Frontend (`frontend/`)

Stack: React + Vite + plain CSS, `react-router-dom`, `axios`. No TypeScript, no Next.js, no Redux, no
component libraries — matches your approved stack.

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to your backend's /api URL
npm run dev
```

### What's built
- **Auth**: login/register (role toggle: listener or artist), session restored via `/auth/me` on load.
- **Home**: album grid + a global track feed.
- **Album detail**: full tracklist, "play album" button.
- **Player bar**: persistent bottom bar — play/pause/skip, seek, volume, a spinning vinyl for the current
  track, and a slide-out queue drawer.
- **Artist tools** (only visible to artist accounts): upload a track (multipart file + title), create an
  album by multi-selecting from your own uploaded tracks.
- Route guards: `/upload` and `/create-album` redirect non-artists home; everything redirects to `/login`
  if you're logged out.

### Design notes
Dark theme (near-black `#100e0f`) with a marigold-gold accent (`#e3a82a`) rather than the generic
Spotify-green-clone look. Type pairing: **Fraunces** (italic serif) for the hero/display lines, **Manrope**
for UI text, **JetBrains Mono** for timestamps/track numbers. The signature element is the spinning vinyl
in the player bar — it only spins while a track is actually playing.

### Deploying
Same pattern as SupportCopilot: frontend → Vercel, backend → Render. Just remember to set `FRONTEND_URL`
on Render to your Vercel domain, and `VITE_API_URL` on Vercel to your Render `/api` URL — both are what
make cookies/CORS work cross-origin.
