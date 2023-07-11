import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    projectchat: [],
    messageStore: [],
    PersonalMessageStore: [],
    personalChat: [],
    count: 0,
    singleCount: 0,
    allPersonalChat:[]
};

const chatStore = createSlice({
  name: "chatStore",
  initialState,
  reducers: {
    setProjectChat: (state, action) => {
      state.projectchat = action.payload;
      state.messageStore = [];
      state.count = 0;
    },
    addCount: (state, action) => {
      state.count = action.payload;
    },
    addMessage: (state, action) => {
      if (action.payload.length > 0) {
        if (action.payload[0].chat._id == state.projectchat._id) {
          state.messageStore.push(...action.payload);
        } else state.messageStore = action.payload;
      }
    },
    addSingleMessage: (state, action) => {
      state.messageStore.splice(0, 0, action.payload);
    },
    addPersonalSingleMessage: (state, action) => {
      state.PersonalMessageStore.splice(0, 0, action.payload);
    },
    singleAddCount: (state, action) => {
      state.singleCount = action.payload;
    },
    setPersonalChat: (state, action) => {
      state.personalChat = action.payload;
      state.PersonalMessageStore = [];
      state.singleCount = 0;
    },
    addPersonalMessage: (state, action) => {
      if (action.payload.length > 0) {
        if (action.payload[0].chat._id == state.personalChat._id) {
          state.PersonalMessageStore.push(...action.payload);
        } else state.PersonalMessageStore = action.payload;
      }
    },
    setAllPersonalChat: (state, action) => {
      state.allPersonalChat = action.payload;
      state.messageStore = [];
      state.count = 0;
    },
  },
});

export const   {setProjectChat,
addMessage,
addCount,
addSingleMessage,
singleAddCount,
setPersonalChat,
addPersonalMessage,
addPersonalSingleMessage,
setAllPersonalChat} = chatStore.actions;
export default chatStore.reducer;
