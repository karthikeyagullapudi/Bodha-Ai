import { useEffect, useState } from 'react';
import { initChatSocket } from '../service/chat.socket.js';

// Keeps a Socket.IO connection open while the dashboard is shown.
// Returns the connection status ('connecting' | 'live' | 'reconnecting' |
// 'offline') and the latest progress update for a reply being generated.
const useChatSocket = () => {
  const [status, setStatus] = useState('connecting');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const socket = initChatSocket();

    socket.on('connect', () => setStatus('live'));
    socket.on('disconnect', () => setStatus('reconnecting'));
    socket.on('connect_error', () => {
      // socket.active is false when the server refused the connection (e.g.
      // an expired login); Socket.IO won't retry on its own in that case
      setStatus(socket.active ? 'reconnecting' : 'offline');
    });
    socket.on('chat:progress', setProgress);

    return () => {
      socket.disconnect();
    };
  }, []);

  return { status, progress };
};

export default useChatSocket;
