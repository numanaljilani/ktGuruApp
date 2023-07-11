import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groupChat: {},
  messageStore: [],
  groupChatData:{},
  count: 0,
};

const groupChatSlice = createSlice({
  name: "groupChat",
  initialState,
  reducers: {
    setGroupChat: (state, action) => {
      state.groupChat = action.payload;
    },
    addSingleMessage: (state, action) => {
      state.messageStore.splice(0, 0, action.payload);
    },
    addMessage: (state, action) => {
      if (action.payload.length > 0) {
          state.messageStore.push(...action.payload) 
      }
    },
    clearMessage: (state, action) => {
       state.messageStore = [];
       state.count = 0
    },
    setGroupChatData:(state,action)=>{
      state.groupChatData = action.payload
    },
    addCount: (state, action) => {
      state.count = action.payload;
    },


  },
});

export const { setGroupChat ,addSingleMessage,setGroupChatData ,addMessage ,clearMessage ,addCount} = groupChatSlice.actions;
export default groupChatSlice.reducer;
