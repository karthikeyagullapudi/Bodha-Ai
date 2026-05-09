import { initChatSocket } from '../service/chat.socket.js';
import {
  getAllChats,
  getSingleChat,
  sendMessage,
  deleteChat,
  getMessages,
} from '../service/chat.api.js';
import { useDispatch } from 'react-redux';
import {
  setChats,
  setCurrentChatId,
  setChatsError,
  setChatsIsLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from '../chat.slice.js';

const useChat = () => {
  const dispatch = useDispatch();

  const handleSendMessage = async (messageData) => {
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
    dispatch(setChatsIsLoading(false));
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
      dispatch(setChatsIsLoading(false));
    } catch (error) {
      dispatch(setChatsError(error.message));
      dispatch(setChatsIsLoading(false));
    }
  };

  const handleOpenChat = async (chatId) => {
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
  };

  return { initChatSocket, handleSendMessage, handleGetChats, handleOpenChat };
};

export default useChat;
