import axios from 'axios';

import clientAPI, { instance } from './clientAPI';
import TokenService from "./token.service";

instance.interceptors.request.use(
  (config) => {
    const accessTokenen = TokenService.getLocalAccessToken();
    if (accessTokenen) {
      config.headers.Authorization = `Bearer ${accessTokenen}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(null, (error) => {
  const originalConfig = error.config;
  const refreshToken = TokenService.getLocalRefreshToken();

	if (
    originalConfig?.url !== '/login' &&
    !originalConfig._retry &&
		error.response?.status === 401 &&
    refreshToken
	) {
    return new Promise(async (resolve, reject) => {
      try {
        // get the new access with refresh token
        const response = await clientAPI.getNewToken(refreshToken);
        // update access token locally
        TokenService.updateLocalAccessToken(response.data.accessToken);
        // attach the new access token to the headers
        originalConfig.headers.Authorization = 'Bearer ' + response.data.accessToken;
        // use a flag call _retry on original Request (config) to handle Infinite loop.
        // It is the case that request is failed again, and the server continue to return 401 status code.
        originalConfig._retry = true;
        // redo the request again with the new access token
        const response2 =	await axios.request(originalConfig);
        resolve(response2);
      } catch (error) {
        reject(error);
      }
    });
	}

	return Promise.reject(error);
});
