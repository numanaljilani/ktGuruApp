import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

const userSclice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },


  },
});

export const { setUser } = userSclice.actions;
export default userSclice.reducer;
