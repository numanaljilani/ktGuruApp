import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chat: {},
  socket:{},
  singleChat : {},
  chatUsers:[],
  users:[]
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action) => {
      state.chat = action.payload;
    },
    setSocket : (state,action)=>{
        state.socket = action.payload;
    },
    setSingleChat : (state,action)=>{
        state.singleChat = action.payload;
    },
    setChatUsers : (state,action)=>{
        state.chatUsers = action.payload;
    },
    setUsers : (state,action)=>{
      state.users = action.payload;
  }


  },
});

export const { setChat ,setSocket,setSingleChat ,setChatUsers , setUsers} = chatSlice.actions;
export default chatSlice.reducer;
