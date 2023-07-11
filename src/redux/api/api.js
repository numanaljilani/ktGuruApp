// Need to use the React-specific entry point to import createApi
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query';rr
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import address from '../../config/address';
import { baseQueryWithReauth } from './refreshApi';


// Define a service using a base URL and expected endpoints
const URL = `${address.PORT}/`;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: build => ({
    signUpApi: build.mutation({
      query: args => {
        // console.log(args, 'args');
        return {
          url: `signup`,
          method: 'POST',
          body: args,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        };
      },
    }),
    loginApi: build.mutation({
      query: args => {
        // console.log(args, 'args');
        return {
          url: `login`,
          method: 'POST',
          body: args,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        };
      },
    }),

    resetpassword: build.mutation({
      query: args => {
        // console.log(args, 'args');
        return {
          url: `resetpassword`,
          method: 'POST',
          body: args,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        };
      },
    }),

    me: build.mutation({
      query: token => {
        console.log(token, 'token');
        return {
          url: `me`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),

    updateprofile: build.mutation({
      query: args => {
        // console.log(args, 'formData');
        // console.log(args, 'argumnets');
        return {
          url: `updateprofile`,
          method: 'POST',
          body: args.inputFormData,
          headers: {
            'Content-type': 'multipart/form-data; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    userprofileAPI: build.mutation({
      query: args => {
        // console.log(args, 'args');
        return {
          url: `userprofile`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    InviteAdmin: build.mutation({
      query: args => {
        // console.log(args, 'args');
        return {
          url: `teams`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    sendNotification: build.mutation({
      query: args => {
        console.log(args, 'args');
        return {
          url: `/andriod-notification`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    logout: build.mutation({
      query: args => {
        // console.log(args, 'args');
        return {
          url: `/logout`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    googleLogIn: build.mutation({
      query: args => {
        console.log(args, 'args');
        return {
          url: `andriod-googlelogin`,
          method: 'POST',
          body: args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginApiMutation,
  useMeMutation,
  useResetpasswordMutation,
  useUpdateprofileMutation,
  useSignUpApiMutation,
  useUserprofileAPIMutation,
  useInviteAdminMutation,
  useSendNotificationMutation,
  useGoogleLogInMutation,
  useLogoutMutation
} = api;
