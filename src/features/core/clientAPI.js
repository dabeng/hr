import axios from "axios";

// Set config defaults when creating the instance
export const instance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    Authorization: localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : ''
  }
});

const clientAPI = {
  loginUser(url, userInfo) {
    return instance.post(url, userInfo);
  },
  logoutUser(url, refreshToken) {
    return instance.post(url, { refreshToken });
  },
  getNewToken(url, refreshToken) {
    return instance.post(url, { refreshToken });
  },
  fetchUserByToken(url) {
    return instance.get(url);
  },
  fetchEmployees(url, params) {
    return instance.get(url, { params });
  },
  fetchEmployee(url) {
    return instance.get(url);
  },
  fetchDepartments(url, params) {
    return instance.get(url, { params });
  }
};

export default clientAPI;
