import { createSlice } from "@reduxjs/toolkit";
import { NavigationContainer } from '@react-navigation/native';

const initialState = {
navigation : false,
loading : false
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigation: (state, action) => {
        state.navigation = action.payload;
      },
      setLoading : (state , action) =>{
        state.loading = action.payload; 
      }
  },
});

export const {setNavigation,setLoading } = navigationSlice.actions;
export default navigationSlice.reducer;
