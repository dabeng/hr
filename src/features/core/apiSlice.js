import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import TokenService from './token.service';

// Define our single API slice object
export default createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with 'http://localhost:3001'
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const accessTokenen = TokenService.getLocalAccessToken();
      if (accessTokenen) {
        headers.set('authorization', `Bearer ${accessTokenen}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Goals'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({})
});