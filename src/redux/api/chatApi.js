// Need to use the React-specific entry point to import createApi
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query';rr
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import address from '../../config/address';
import { baseQueryWithReauth } from './refreshApi';


// Define a service using a base URL and expected endpoints
const URL = `${address.PORT}/`;

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithReauth,
  endpoints: build => ({
    groupchat: build.mutation({
      query: args => {
        // console.log(args)
        return {
          url: `groupchat`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    message: build.mutation({
      query: args => {
        // console.log(args, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>args');
        return {
          url: `message`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    allmessage: build.mutation({
      query: args => {
        // console.log(args, 'args >>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return {
          url: `allmessage/${args.id}/${args.skip}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    allSingleChat: build.mutation({
      query: args => {
        // console.log(args, 'args >>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return {
          url: `allsinglechats`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    singleChat: build.mutation({
      query: args => {
        // console.log(args, 'args >>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return {
          url: `singlechat`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),




  



  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
useGroupchatMutation,
useAllmessageMutation,
useMessageMutation,
useAllSingleChatMutation,
useSingleChatMutation
} = chatApi;
