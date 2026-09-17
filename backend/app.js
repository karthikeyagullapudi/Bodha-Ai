import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.routes.js';
import chatRouter from './src/routes/chat.routes.js';
import morgan from 'morgan';

const app = express();

// Render forwards requests through one or more proxies on its private network.
// Trusting private addresses lets req.ip and req.protocol reflect the real
// visitor (used by rate limiting and email links); a client can't fake this,
// since its own address is public.
app.set('trust proxy', 'loopback, uniquelocal');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRouter);

// Unknown API routes get a JSON 404 instead of the React app
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Serve the built React app (frontend/dist) so the whole project runs on one URL
const frontendDist = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../frontend/dist',
);
app.use(express.static(frontendDist));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Last-resort error handler: log the details, but never send a stack trace
// to the browser
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.expose ? err.message : 'Something went wrong. Please try again.',
  });
});

export default app;
