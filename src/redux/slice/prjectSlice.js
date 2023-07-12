import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: {},
  projectResources: {},
  resourceUserInfo: {},
};

const projectSclice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setResource: (state, action) => {
      state.projectResources = action.payload;
    },
    setUserInfo: (state, action) => {
      state.resourceUserInfo = action.payload;
    },
  },
});

export const { setProject, setResource, setUserInfo } = projectSclice.actions;
export default projectSclice.reducer;
