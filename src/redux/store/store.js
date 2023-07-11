import {combineReducers, configureStore,} from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import {setupListeners} from '@reduxjs/toolkit/query';
import {api} from '../api/api';
import  tokenReducer  from "../slice/tokenSlice"
import userReducer from "../slice/userSlice"
import projectReducer from "../slice/prjectSlice"
import questionReducer from "../slice/questionSlice"
import groupChatReducer from "../slice/groupChat"
import chatReducer from "../slice/chatSlice"
import subProjectReducer from "../slice/subProject"
import subProjectChatReducer from "../slice/subProjectChatSlice"
import  chatStoreReducer  from "../slice/chatSotre"
import { project } from '../api/projectApi';
import { subProject } from '../api/subProjectApi';
import { discussionApi } from '../api/discussion';
import { chatApi } from '../api/chatApi';
import chatNotificationReducer from "../slice/cahtNotificationSlice"
import navigationReducer from '../slice/navigationSlice';
import activityReducer from '../slice/activitySlice';

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage : AsyncStorage ,
// };
const reducer = combineReducers({
  token : tokenReducer,
  user : userReducer,
  project : projectReducer,
  question : questionReducer,
  groupChat : groupChatReducer,
  chat : chatReducer,
  subProject : subProjectReducer,
  subChat : subProjectChatReducer,
  chatStore : chatStoreReducer,
  chatNotification : chatNotificationReducer,
  navigation : navigationReducer,
  activity : activityReducer

})

// const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: {
    reducer,
    // persistedReducer,
    // Add the generated reducer as a specific top-level slice
    [api.reducerPath]: api.reducer,
    [project.reducerPath]: project.reducer,
    [subProject.reducerPath]: subProject.reducer,
    [discussionApi.reducerPath]: discussionApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {warnAfter: 128},
      serializableCheck: {warnAfter: 128},
      serializableCheck : false
    }).concat(api.middleware , project.middleware ,subProject.middleware,discussionApi.middleware ,chatApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
