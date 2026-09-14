import { io } from 'socket.io-client';

export const initChatSocket = () => {
  // No URL: connects to the same site the page was loaded from
  const socket = io({
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Connected to server', socket.id);
  });

  return socket;
};
