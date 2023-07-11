
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import address from '../../config/address';
import { baseQueryWithReauth } from './refreshApi';


// Define a service using a base URL and expected endpoints
const URL = `${address.PORT}/`;

export const discussionApi = createApi({
  reducerPath: 'discussionApi',
  baseQuery: baseQueryWithReauth,
  endpoints: build => ({
    allquestions: build.mutation({
      query: args => {
        // console.log(args, 'GET ALL QUESTION');
        return {
          url: `allquestions`,
          method: 'POST',
          body:args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    question: build.mutation({
      query: args => {

        // console.log(args, 'Form data');
        return {
          url: `question`,
          method: 'POST',
          body: args.formData,
          headers: {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    answer: build.mutation({
      query: args => {

        // console.log(args, 'Form data');
        return {
          url: `answer/${args.id}`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    summaryquestion: build.mutation({
      query: args => {

        console.log(args, 'Form data');
        return {
          url: `summaryquestion/${args.id}`,
          method: 'PUT',
          body: args.formData,
          headers: {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),


    singlequestions: build.mutation({
      query: args => {

        // console.log(args, 'Form data');
        return {
          url: `singlequestions/${args.id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    comment: build.mutation({
      query: args => {

        // console.log(args, 'comments');
        return {
          url: `comment`,
          method: 'POST',
          body:args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),


  }),
});

export const {useAllquestionsMutation ,useQuestionMutation , useAnswerMutation ,useSinglequestionsMutation ,useCommentMutation ,useSummaryquestionMutation} = discussionApi;
