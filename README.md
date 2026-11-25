# backend-app

| Folder | What |
|---|---|
| `backend-course/` | Express 5 + MongoDB API (auth with httpOnly JWT cookie, Zod validation) |
| `backend-ui/` | Angular 22 + Angular Material frontend |

All API routes live under `/api`. In production the Express server also serves the
built Angular app, so browser and API share one origin (no CORS, `sameSite=strict` cookie works).

## Development

```bash
cp backend-course/.env.example backend-course/.env   # then fill in the values
npm install --prefix backend-course
npm install --prefix backend-ui
npm run dev --prefix backend-course    # API on http://localhost:3001
npm start --prefix backend-ui          # UI on http://localhost:4200, /api proxied to :3001
```

## Production-like run locally

```bash
npm run build --prefix backend-ui
npm start --prefix backend-course      # app + API on http://localhost:3001
```

## Deploy to Render

1. Push this repository to GitHub/GitLab.
2. MongoDB Atlas → Network Access: allow `0.0.0.0/0` (Render's outgoing IPs change on the free plan).
3. Render → **New → Blueprint** → select the repository. `render.yaml` creates one web service.
4. Enter `MONGODB_URI` when asked. `JWT_SECRET` is generated, `NODE_ENV=production` makes the cookie `secure`.
5. After the deploy, open `https://<service>.onrender.com` and run the seed once if the database is empty
   (Render shell: `npm run seed --prefix backend-course` – this deletes all users first).

The free plan sleeps after ~15 minutes without traffic; the first request then takes a while.
