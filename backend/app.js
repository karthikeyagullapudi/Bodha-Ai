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

// Visitors reach the app through Cloudflare and then Render's internal
// proxies. Trusting exactly those hops makes req.ip and req.protocol describe
// the real visitor (used by rate limiting and email links); anything a client
// writes into X-Forwarded-For stays to the left of its own public address.
// Ranges from https://www.cloudflare.com/ips/
const CLOUDFLARE_IPS = [
  '173.245.48.0/20',
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '141.101.64.0/18',
  '108.162.192.0/18',
  '190.93.240.0/20',
  '188.114.96.0/20',
  '197.234.240.0/22',
  '198.41.128.0/17',
  '162.158.0.0/15',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '172.64.0.0/13',
  '131.0.72.0/22',
  '2400:cb00::/32',
  '2606:4700::/32',
  '2803:f800::/32',
  '2405:b500::/32',
  '2405:8100::/32',
  '2a06:98c0::/29',
  '2c0f:f248::/32',
];
app.set('trust proxy', ['loopback', 'uniquelocal', ...CLOUDFLARE_IPS]);

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
