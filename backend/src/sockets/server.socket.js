import { Server } from 'socket.io';

let io;

export const initSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  console.log('Socket server initialized');

  io.on('connection', (socket) => {
    console.log('User connected', socket.id);
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket server not initialized');
  }

  return io;
};
