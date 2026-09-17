import { io } from 'socket.io-client';

export const initChatSocket = () => {
  // No URL: connects to the same site the page was loaded from. The login
  // cookie is sent along, which is how the server knows who is connecting.
  return io({
    withCredentials: true,
  });
};
