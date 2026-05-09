import { createSlice } from '@reduxjs/toolkit';

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
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
      // state.chats[chatId].lastUpdatedAt = new Date().toISOString();
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
} = chatSlice.actions;
export default chatSlice.reducer;

// chats = {
//     'know more about india':{
//         messages:[
//             {
//                 content:'what is its caputal',
//             role:'user'
//         },
//         {
//             constent:'Delhi',
//             role:'ai'
//         }
//         ],
//         id:'skjdhfkjsahdfkas',
//         lastUpdatedAt:"29-2-12"

//     }
// }
