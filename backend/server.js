import 'dotenv/config';
import app from './app.js';
import connectDb from './src/config/db.js';
import http from 'http';
import { initSocketServer } from './src/sockets/server.socket.js';

const httpServer = http.createServer(app);

connectDb().then(() => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

  initSocketServer(httpServer);
});
