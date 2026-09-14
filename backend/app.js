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

// Serve the built React app (frontend/dist) so the whole project runs on one URL
const frontendDist = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../frontend/dist',
);
app.use(express.static(frontendDist));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

export default app;
