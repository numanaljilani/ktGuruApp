import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subProject: {},
  subProjectList : []
};

const subProjectSclice = createSlice({
  name: "subProject",
  initialState,
  reducers: {
    setSubProject: (state, action) => {
      state.subProject = action.payload;
    },

    setSubProjectList : (state , action) => {
      state.subProjectList = action.payload
    }
  },
});

export const { setSubProject ,setSubProjectList} = subProjectSclice.actions;
export default subProjectSclice.reducer;
