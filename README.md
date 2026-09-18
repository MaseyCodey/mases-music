# Mase's Music

## Change the site name or logo

Edit `public/config.js`. Change `siteName` once to update the browser title, sidebar, top bar, player, song pages, and branded labels. Change `logoUrl` to use a different logo, and `logoLink` to control where clicking either logo goes.

A guest-friendly Vercel music app with Neon Postgres accounts, private likes/playlists, three persistent themes, secure GitHub-backed admin uploads, song requests, next-track prefetching, and Media Session controls.

## Setup

1. Install Node.js 20+, then run `npm install`.
2. Copy `.env.example` to `.env` and provide a Neon `DATABASE_URL`.
3. Generate the admin hash: `npm run hash-password -- "YOUR_ADMIN_PASSWORD"`.
4. Put that output in `ADMIN_PASSWORD_HASH`, set `ADMIN_EMAIL`, and create `JWT_SECRET` with `openssl rand -base64 48`.
5. To add a second administrator, set `ADMIN_EMAIL_2` and a separately generated `ADMIN_PASSWORD_HASH_2`. Never commit either value.
5. Run `npm start` and open `http://localhost:3000`.

Never commit `.env`, tokens, or the SQLite database. Production requires HTTPS, `NODE_ENV=production`, and the exact public URL in `APP_ORIGIN`.

## Free GitHub music storage

Admin Studio can commit uploaded audio directly to the repository's `music/` folder. Create a fine-grained GitHub personal access token with **Contents: Read and write** access only to this repository, then set `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `GITHUB_BRANCH`, and `GITHUB_MUSIC_PATH` in the host's private environment settings. Never put the token in a file or browser code.

The catalog is stored in `music/tracks.json`. Audio is publicly accessible because this repository is public. Vercel-hosted Studio uploads are limited to 4 MB, so use compressed MP3/M4A files. Only upload music you have permission to distribute.

## Vercel + Neon deployment

Import this repository into Vercel, then add a Neon Postgres integration from the Vercel Marketplace. Neon supplies `DATABASE_URL`. Add every remaining value from `.env.example` in Vercel's Environment Variables settings and redeploy. `api/index.js` and `vercel.json` provide the serverless entry point.

## Security

Passwords use bcrypt. Signed JWTs live only in HTTP-only, SameSite=Strict cookies. Admin middleware verifies both the session and an exact match to `ADMIN_EMAIL`. The server also uses strict origin checks, prepared SQL, validation/sanitization, rate limiting, Helmet CSP, randomized uploads, file size/MIME/signature checks, and generic login failures.

## Audio

HTTP byte ranges provide quick seeking; the client aggressively prefetches and decodes the next song. Media Session enables supported keyboard and lock-screen controls. Truly sample-accurate gaplessness also depends on source files/codecs having no encoder padding.

Run `npm test` for the security tests.
