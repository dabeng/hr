import axios from "axios";

const clientAPI = {
  loginUser(url, userInfo) {
    return axios.post(url, userInfo);
  },
  getNewToken(url, refreshToken) {
    return axios.post(url, { refreshToken });
  },
  fetchUserByToken(url, token) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers });
  },
  fetchEmployees(url, params, token) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers, params });
  },
  fetchEmployee(url, token) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers });
  },
  fetchDepartments(url, params, token) {
    const headers = {
      Authorization: "Bearer " + token,
    };
    return axios.get(url, { headers, params });
  }
};

export default clientAPI;
