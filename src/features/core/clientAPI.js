import axios from "axios";

// Set config defaults when creating the instance
export const instance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    Authorization: localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : ''
  }
});

const clientAPI = {
  loginUser(userInfo) {
    return instance.post("/login", userInfo);
  },
  logoutUser(refreshToken) {
    return instance.post("/logout", { refreshToken });
  },
  getNewToken(refreshToken) {
    return instance.post("/token", { refreshToken });
  },
  fetchUserByToken() {
    return instance.get("/user");
  },
  fetchEmployees(params) {
    return instance.get("/employees", { params });
  },
  fetchEmployee(employeeId) {
    return instance.get("/employees/" + employeeId);
  },
  fetchDepartments(params) {
    return instance.get("/departments", { params });
  }
};

export default clientAPI;
