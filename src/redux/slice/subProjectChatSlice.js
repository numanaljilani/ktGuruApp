import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subChat: {},
  subSingleChat : {},
  subChatUsers:[]
};

const subProjectChatSlice = createSlice({
  name: "subChat",
  initialState,
  reducers: {
    setSubChat: (state, action) => {
      state.subChat = action.payload;
    },
    setSubSingleChat : (state,action)=>{
        state.subSingleChat = action.payload;
    },
    setSubChatUsers : (state,action)=>{
        state.subChatUsers = action.payload;
    }


  },
});

export const { setSubChat ,setSubSingleChat ,setSubChatUsers} = subProjectChatSlice.actions;
export default subProjectChatSlice.reducer;
