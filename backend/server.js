import 'dotenv/config';
import app from './app.js';
import connectDb from './src/config/db.js';
import http from 'http';
import { initSocketServer } from './src/sockets/server.socket.js';

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

connectDb().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  initSocketServer(httpServer);
});
