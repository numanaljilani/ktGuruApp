import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  question: {},
  allQuestions :[],
  allSubQuestions : [],
};

const questionSclice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestion: (state, action) => {
      state.question = action.payload;
    },

    setAllQuestion : (state , action) =>{
      state.allQuestions = action.payload;
    },
    setAllSubQuestion : (state,action)=>{
      state.allSubQuestions = action.payload;
    }


  },
});

export const { setQuestion ,setAllQuestion , setAllSubQuestion} = questionSclice.actions;
export default questionSclice.reducer;
