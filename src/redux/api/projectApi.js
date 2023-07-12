// Need to use the React-specific entry point to import createApi
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query';rr
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import address from "../../config/address";
import { baseQueryWithReauth } from "./refreshApi";

// Define a service using a base URL and expected endpoints
const URL = `${address.PORT}/`;
// console.log(baseQueryWithReauth)

export const project = createApi({
  reducerPath: "project",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    getallproject: build.mutation({
      query: (token) => {
        // console.log(token, 'getallproject');
        return {
          url: `getallproject`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    deleteprojectAPI: build.mutation({
      query: (args) => {
        // console.log(args, 'deleteproject');
        return {
          url: `deleteproject/${args.id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    updateprojectAPI: build.mutation({
      query: (args) => {
        // console.log(args, 'updateproject');
        return {
          url: `updateproject/${args.id}`,
          method: "PUT",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    createprojectAPI: build.mutation({
      query: (args) => {
        // console.log(args, 'updateproject');
        return {
          url: `createproject`,
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    teams: build.mutation({
      query: (args) => {
        // console.log(args, 'updateproject');
        return {
          url: `teams`,
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    add: build.mutation({
      query: (args) => {
        // console.log(args, 'updateproject');
        return {
          url: `add`,
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    activity: build.mutation({
      query: (args) => {
        // console.log(args, 'updateproject');
        return {
          url: `activity/${args.projectId}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    getresources: build.mutation({
      query: (args) => {
        // console.log(args, 'updateproject');
        return {
          url: `get-resourcesdata`,
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    notification: build.mutation({
      query: (args) => {
        // console.log(args, 'updateproject');
        return {
          url: `notification`,
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
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
  useGetallprojectMutation,
  useDeleteprojectAPIMutation,
  useUpdateprojectAPIMutation,
  useCreateprojectAPIMutation,
  useTeamsMutation,
  useAddMutation,
  useActivityMutation,
  useNotificationMutation,
  useGetresourcesMutation,
} = project;
