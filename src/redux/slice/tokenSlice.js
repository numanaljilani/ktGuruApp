import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: {},
};

const tokenSclice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken } = tokenSclice.actions;
export default tokenSclice.reducer;
