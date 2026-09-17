# Mase's Music

A guest-friendly streaming app with accounts, private likes/playlists, three persistent themes, secure admin uploads, song requests, byte-range streaming, next-track prefetching, and Media Session controls.

## Setup

1. Install Node.js 20+, then run `npm install`.
2. Copy `.env.example` to `.env`.
3. Generate the admin hash: `npm run hash-password -- "YOUR_ADMIN_PASSWORD"`.
4. Put that output in `ADMIN_PASSWORD_HASH`, set `ADMIN_EMAIL`, and create `JWT_SECRET` with `openssl rand -base64 48`.
5. Run `npm start` and open `http://localhost:3000`.

Never commit `.env`, tokens, or the SQLite database. Production requires HTTPS, `NODE_ENV=production`, and the exact public URL in `APP_ORIGIN`.

## Free GitHub music storage

Admin Studio can commit uploaded audio directly to the repository's `music/` folder. Create a fine-grained GitHub personal access token with **Contents: Read and write** access only to this repository, then set `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `GITHUB_BRANCH`, and `GITHUB_MUSIC_PATH` in the host's private environment settings. Never put the token in a file or browser code.

The catalog is stored in `music/tracks.json`. Audio is publicly accessible because this repository is public. Keep each upload under 25 MB and only upload music you have permission to distribute.

GitHub Pages cannot run this Node backend. Keep the source on GitHub and deploy it to a Node host such as Render, Railway, Fly.io, or a VPS.

## Security

Passwords use bcrypt. Signed JWTs live only in HTTP-only, SameSite=Strict cookies. Admin middleware verifies both the session and an exact match to `ADMIN_EMAIL`. The server also uses strict origin checks, prepared SQL, validation/sanitization, rate limiting, Helmet CSP, randomized uploads, file size/MIME/signature checks, and generic login failures.

## Audio

HTTP byte ranges provide quick seeking; the client aggressively prefetches and decodes the next song. Media Session enables supported keyboard and lock-screen controls. Truly sample-accurate gaplessness also depends on source files/codecs having no encoder padding.

Run `npm test` for the security tests.
