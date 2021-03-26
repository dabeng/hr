import axios from "axios";

const userAPI = {
  loginUser(url, userInfo) {
    return axios.post(url, userInfo);
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
  }
};

export default userAPI;
