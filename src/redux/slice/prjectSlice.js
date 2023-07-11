import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: {},
};

const projectSclice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.project = action.payload;
    },
  },
});

export const { setProject } = projectSclice.actions;
export default projectSclice.reducer;
