// Need to use the React-specific entry point to import createApi
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query';rr
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import address from '../../config/address';
import { baseQueryWithReauth } from './refreshApi';


// Define a service using a base URL and expected endpoints
const URL = `${address.PORT}/`;

export const subProject = createApi({
  reducerPath: 'subProject',
  baseQuery: baseQueryWithReauth,
  endpoints: build => ({

    getAllProject: build.mutation({
      query: args => {
        // console.log(args, 'SUB get All Project');
        return {
          url: `getallsubproject`,
          method: 'POST',
          body:args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    createsubproject: build.mutation({
      query: args => {
        // console.log(args, 'SUB create');
        return {
          url: `createsubproject`,
          method: 'POST',
          body:args.body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    deleteSubProject: build.mutation({
      query: args => {
        // console.log(args, 'SUB DELETE');
        return {
          url: `deletesubproject/${args.id}`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),
    updateSubProject: build.mutation({
      query: args => {
        // console.log(args, 'SUB DELETE');
        return {
          url: `updatesubproject/${args.id}`,
          method: 'PUT',
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
export const {useGetAllProjectMutation,useCreatesubprojectMutation,useDeleteSubProjectMutation,useUpdateSubProjectMutation} = subProject;
