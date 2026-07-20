import { generateResponse, generateTitle } from '../services/ai.service.js';
import chatModel from '../model/chat.model.js';
import messageModel from '../model/message.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, chat: chatId } = req.body;

    let chat = null;
    let title = null;

    if (!chatId) {
      title = await generateTitle(message);
      chat = await chatModel.create({
        user: req.user._id,
        title: title,
      });
    } else {
      chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: 'Chat not found',
        });
      }
      title = chat.title;
    }

    const targetChatId = chatId || chat._id;

    const userMessage = await messageModel.create({
      chat: targetChatId,
      content: message,
      role: 'user',
    });

    const messages = await messageModel.find({ chat: targetChatId });

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: targetChatId,
      content: result,
      role: 'ai',
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      title,
      chat,
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.error('Error in sendMessage controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate response',
    });
  }
};

export const getAllChats = async (req, res) => {
  const user = req.user;

  const chats = await chatModel.find({ user: user._id });

  res.status(200).json({
    success: true,
    message: 'Chats received successfully',
    chats: chats,
  });
};

export const getMessages = async (req, res) => {
  const chatId = req.params.chatId;
  const chat = await chatModel.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found',
    });
  }

  const user = req.user;

  if (chat.user.toString() !== user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to access this chat',
    });
  }

  const messages = await messageModel.find({ chat: chatId });

  res.status(200).json({
    success: true,
    message: 'Messages received successfully',
    messages: messages,
  });
};

export const deleteChat = async (req, res) => {
  const chatId = req.params.chatId;
  const chat = await chatModel.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found',
    });
  }

  const user = req.user;

  if (chat.user.toString() !== user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to access this chat',
    });
  }

  await chatModel.findByIdAndDelete(chatId);
  await messageModel.deleteMany({ chat: chatId });

  res.status(200).json({
    success: true,
    message: 'Chat deleted successfully',
  });
};

export const renameChat = async (req, res) => {
  const chatId = req.params.chatId;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Title is required',
    });
  }

  const chat = await chatModel.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: 'Chat not found',
    });
  }

  const user = req.user;

  if (chat.user.toString() !== user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to update this chat',
    });
  }

  chat.title = title.trim();
  await chat.save();

  res.status(200).json({
    success: true,
    message: 'Chat title updated successfully',
    chat,
  });
};

