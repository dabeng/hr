import axios from 'axios';

import clientAPI, { instance } from './clientAPI';

instance.interceptors.response.use(null, (error) => {
	if (
		error.response && error.response.status === 401 && 
		error.config && !error.config.__isRetry && // TODO: what is __isRetry
    localStorage.getItem('refreshToken')
	) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await clientAPI.getNewToken("/token", localStorage.getItem('refreshToken'));
        localStorage.setItem('accessToken', response.data.accessToken);
        error.config.headers.Authorization = 'Bearer ' + response.data.accessToken;
        // Repeat the initial request
        const response2 =	await axios.request(error.config);
        resolve(response2);
      } catch (err) {
        reject(err);
      }
    });
	}
	return Promise.reject(error);
});
