import { Router } from 'express';
import {
  sendMessage,
  getAllChats,
  getMessages,
  deleteChat,
  renameChat,
} from '../controller/chat.controller.js';
import { identifyUser } from '../middleware/auth.middleware.js';

const chatRouter = Router();

chatRouter.post('/message', identifyUser, sendMessage);
chatRouter.get('/chats', identifyUser, getAllChats);
chatRouter.get('/chat/:chatId', identifyUser, getMessages);
chatRouter.delete('/delete-chat/:chatId', identifyUser, deleteChat);
chatRouter.put('/rename-chat/:chatId', identifyUser, renameChat);

export default chatRouter;

