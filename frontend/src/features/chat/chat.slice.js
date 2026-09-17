import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: {},
  currentChatId: null,
  isLoading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: title,
          messages: [],
          lastUpdatedAt: new Date().toISOString(),
        };
      }
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chats[chatId].messages.push({ content, role });
      state.chats[chatId].lastUpdatedAt = new Date().toISOString();
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].messages = messages;
      }
    },

    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setChatsError: (state, action) => {
      state.error = action.payload;
    },
    setChatsIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    removeChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      if (state.chats[chatId]) {
        state.chats[chatId].title = title;
      }
    },
    // Clears everything on logout so the next account starts fresh
    resetChats: () => initialState,
  },
});

export const {
  setChats,
  setCurrentChatId,
  setChatsError,
  setChatsIsLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  removeChat,
  updateChatTitle,
  resetChats,
} = chatSlice.actions;
export default chatSlice.reducer;
