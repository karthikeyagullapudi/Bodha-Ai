import { initChatSocket } from '../service/chat.socket.js';
import {
  getAllChats,
  sendMessage,
  deleteChat,
  getMessages,
  renameChat,
} from '../service/chat.api.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../auth/auth.slice.js';
import {
  setChats,
  setCurrentChatId,
  setChatsError,
  setChatsIsLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  removeChat,
  updateChatTitle,
} from '../chat.slice.js';

const useChat = () => {
  const dispatch = useDispatch();

  // An expired session makes every request fail with 401; send the user back
  // to the login page instead of showing a broken dashboard
  const handleAuthError = (error) => {
    if (error.response?.status === 401) dispatch(setUser(null));
  };

  const handleSendMessage = async (messageData) => {
    try {
      dispatch(setChatsError(null));
      dispatch(setChatsIsLoading(true));
      const data = await sendMessage(messageData);
      const targetChatId = messageData.chatId || data.chat?._id;
      const { chat, aiMessage, userMessage } = data;

      // Only create a new chat entry in Redux if this is a brand new chat
      if (!messageData.chatId) {
        dispatch(
          createNewChat({
            chatId: targetChatId,
            title: chat.title,
          }),
        );
        dispatch(setCurrentChatId(targetChatId));
      }

      dispatch(
        addNewMessage({
          chatId: targetChatId,
          content: userMessage.content,
          role: userMessage.role,
        }),
      );
      dispatch(
        addNewMessage({
          chatId: targetChatId,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
      return true;
    } catch (error) {
      handleAuthError(error);
      // Prefer the server's message (e.g. AI provider failure) over axios's generic one
      dispatch(setChatsError(error.response?.data?.message || error.message));
      return false;
    } finally {
      dispatch(setChatsIsLoading(false));
    }
  };

  const handleGetChats = async () => {
    try {
      dispatch(setChatsIsLoading(true));
      const data = await getAllChats();
      const { chats } = data;

      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdatedAt: chat.updatedAt,
            };
            return acc;
          }, {}),
        ),
      );
    } catch (error) {
      handleAuthError(error);
      dispatch(setChatsError(error.response?.data?.message || error.message));
    } finally {
      dispatch(setChatsIsLoading(false));
    }
  };

  const handleOpenChat = async (chatId) => {
    try {
      const data = await getMessages(chatId);
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
      dispatch(setCurrentChatId(chatId));
    } catch (error) {
      handleAuthError(error);
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      dispatch(removeChat(chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await renameChat(chatId, newTitle);
      dispatch(updateChatTitle({ chatId, title: newTitle }));
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  return {
    initChatSocket,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleRenameChat,
  };
};

export default useChat;

