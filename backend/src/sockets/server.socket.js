import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

const readTokenCookie = (cookieHeader = '') => {
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const userRoom = (userId) => `user:${userId}`;

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  // Only logged-in users may connect; they use the same cookie as the API
  io.use((socket, next) => {
    try {
      const token = readTokenCookie(socket.handshake.headers.cookie);
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = id;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  console.log('Socket server initialized');

  io.on('connection', (socket) => {
    // Each user gets a room, so events reach all of their open tabs
    socket.join(userRoom(socket.data.userId));
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket server not initialized');
  }

  return io;
};

export const emitToUser = (userId, event, payload) => {
  io?.to(userRoom(userId.toString())).emit(event, payload);
};
