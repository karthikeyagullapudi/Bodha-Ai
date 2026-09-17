import mongoose from 'mongoose';
import { generateResponse, generateTitle } from '../services/ai.service.js';
import chatModel from '../model/chat.model.js';
import messageModel from '../model/message.model.js';

// Loads a chat and checks it belongs to the user. Sends the error response
// itself and returns null when the chat can't be used.
const findOwnChat = async (chatId, user, res) => {
  const chat = mongoose.isValidObjectId(chatId)
    ? await chatModel.findById(chatId)
    : null;

  if (!chat) {
    res.status(404).json({
      success: false,
      message: 'Chat not found',
    });
    return null;
  }

  if (chat.user.toString() !== user._id.toString()) {
    res.status(403).json({
      success: false,
      message: 'Unauthorized to access this chat',
    });
    return null;
  }

  return chat;
};

const sendServerError = (res, error, fallbackMessage) => {
  console.error(error);
  // Only errors raised on purpose (with a status) carry a user-facing message
  res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : fallbackMessage,
  });
};

export const sendMessage = async (req, res) => {
  try {
    const { chat: chatId } = req.body;
    const message =
      typeof req.body.message === 'string' ? req.body.message.trim() : '';

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    let chat = null;
    let history = [];

    if (chatId) {
      chat = await findOwnChat(chatId, req.user, res);
      if (!chat) return;
      history = await messageModel.find({ chat: chat._id }).sort({ _id: 1 });
    }

    // Get the AI reply before saving anything, so a failed request doesn't
    // leave an empty chat or an unanswered message behind
    const [content, title] = await Promise.all([
      generateResponse([...history, { role: 'user', content: message }]),
      chat ? chat.title : generateTitle(message),
    ]);

    if (chat) {
      // Bump updatedAt so the chat moves to the top of the list
      chat.updatedAt = new Date();
      await chat.save();
    } else {
      chat = await chatModel.create({
        user: req.user._id,
        title,
      });
    }

    const [userMessage, aiMessage] = await messageModel.insertMany([
      { chat: chat._id, content: message, role: 'user' },
      { chat: chat._id, content, role: 'ai' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      title,
      chat,
      userMessage,
      aiMessage,
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to generate response');
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await chatModel
      .find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Chats received successfully',
      chats: chats,
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to load chats');
  }
};

export const getMessages = async (req, res) => {
  try {
    const chat = await findOwnChat(req.params.chatId, req.user, res);
    if (!chat) return;

    const messages = await messageModel
      .find({ chat: chat._id })
      .sort({ _id: 1 });

    res.status(200).json({
      success: true,
      message: 'Messages received successfully',
      messages: messages,
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to load messages');
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chat = await findOwnChat(req.params.chatId, req.user, res);
    if (!chat) return;

    await chatModel.findByIdAndDelete(chat._id);
    await messageModel.deleteMany({ chat: chat._id });

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to delete chat');
  }
};

export const renameChat = async (req, res) => {
  try {
    const title =
      typeof req.body.title === 'string' ? req.body.title.trim() : '';

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const chat = await findOwnChat(req.params.chatId, req.user, res);
    if (!chat) return;

    chat.title = title.slice(0, 100);
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat title updated successfully',
      chat,
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to rename chat');
  }
};
