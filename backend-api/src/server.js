import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import path from 'node:path';
import connectDB from './config/db.js';

// https://www.youtube.com/watch?v=g09PoiCob4Y
// https://github.com/machadop1407/NodeJS-ExpressJS-BackendCourse

const app = express();

config();
connectDB();

// import routes
import authRoutes from './routes/auth.route.js';

// body parsing middleware: reads JSON (and form) request bodies into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parsing middleware: reads cookies (e.g. the "jwt" login cookie) into req.cookies
app.use(cookieParser());

// declare API routes – all under /api, so they never collide with Angular page URLs
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

// Unknown API URLs get a JSON 404 (and not the Angular index.html below)
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Serve the built Angular app (backend-ui) from the same server, so the browser sees
// one site: no CORS, and the sameSite=strict "jwt" cookie keeps working.
// Default: the sibling folder ../backend-ui; override with UI_DIST_PATH.
const uiDist = path.resolve(
  process.env.UI_DIST_PATH ?? path.join(import.meta.dirname, '../../backend-ui/dist/backend-ui/browser'),
);
const uiIndex = path.join(uiDist, 'index.html');

if (existsSync(uiIndex)) {
  app.use(
    express.static(uiDist, {
      index: false, // index.html is sent by the fallback below, without long caching
      setHeaders: (res, filePath) => {
        // Angular's hashed bundles (main-2FKSKOV3.js) never change: cache them for a year
        if (/-[A-Za-z0-9_-]{8}\.(js|css)$/.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    }),
  );

  // Every other GET is an Angular route (/login, /register, …): send index.html
  // so reloading or opening a deep link works. Express 5 wildcard syntax.
  app.get('/{*path}', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(uiIndex);
  });
  console.log(`Serving Angular app from ${uiDist}`);
} else {
  console.log(`No Angular build at ${uiDist} – API only (use "ng serve" for the UI in development)`);
}

// Render (and most hosts) tell the app which port to use via PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
