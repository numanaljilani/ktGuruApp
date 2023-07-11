import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectNotification: [],
  selectedChatCompare:"",
  projectChatNotifications:[]
};

const ChatNotificationSlice = createSlice({
  name: "projectNotification",
  initialState,
  reducers: {
    AddProjectNotification: (state, action) => {
      state.projectChatNotifications.splice(0, 0, action.payload);
      // state.projectNotification = action.payload
    },
    AddProjectNotificationFromApi: (state, action) => {
      // state.projectNotification.push(...action.payload);
      state.projectNotification = action.payload
    },
    AddSelectedChatCompare: (state, action) => {
      state.selectedChatCompare = action.payload
    },
    AddProjectChatNotify: (state, action) => {
      state.projectChatNotifications = action.payload
    },
  },
});

export const {
  AddProjectNotification,
  AddProjectChatNotify,
  AddProjectNotificationFromApi,
  AddSelectedChatCompare,
} = ChatNotificationSlice.actions;
export default ChatNotificationSlice.reducer;

