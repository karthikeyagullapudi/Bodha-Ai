import axios from 'axios';

const httpClint = axios.create({
  baseURL: 'http://localhost:3000/api/chats',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendMessage = async (messageData) => {
  const { message, chatId } = messageData;
  const response = await httpClint.post('/message', {
    message,
    chat: chatId || null,
  });

  return response.data;
};

export const getSingleChat = async (chatId) => {
  const response = await httpClint.get(`/chat/${chatId}`);
  return response.data;
};

export const getAllChats = async () => {
  const response = await httpClint.get('/chats');
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await httpClint.delete(`/delete-chat/${chatId}`);
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await httpClint.get(`/chat/${chatId}`);
  return response.data;
};

export const renameChat = async (chatId, title) => {
  const response = await httpClint.put(`/rename-chat/${chatId}`, { title });
  return response.data;
};

