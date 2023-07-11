import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectActivity: [],
  SubProjectActivity : [],
};

const activitySclice = createSlice({
  name: "Activity",
  initialState,
  reducers: {
    setProjectActivity: (state, action) => {
      state.projectActivity = action.payload;
    },
    setSubProjectActivity: (state, action) => {
        state.SubProjectActivity = action.payload;
      },
  },
});

export const { setProjectActivity , setSubProjectActivity } = activitySclice.actions;
export default activitySclice.reducer;
