import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import address from "../../config/address";
import { setNavigation } from "../slice/navigationSlice";
import { setToken } from "../slice/tokenSlice";

// create a new mutex
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({ baseUrl: address.PORT });
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);
  let refreshToken = await api.getState().reducer.token.token.refresh_token;
  // console.log(refreshToken,">>>>>>>>>>>>>>>>>>>>>>>")

  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(`/refresh/${refreshToken}`, api, {
          ...extraOptions,
          // method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: { refresh_token:token }
        });
        if (refreshResult.data) {
          await api.dispatch(setToken(refreshResult.data));

          args.headers.authorization = `bearer ${refreshResult.data.access_token}`;
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(setNavigation(true));
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
