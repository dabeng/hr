import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./features/core/Layout";
import { LoginPage } from "./features/core/LoginPage";
import NotFoundPage from "./features/core/NotFoundPage";
import RequireAuth from "./features/core/RequireAuth";

import Profile from "./features/profile/Profile";
import EditProfile from "./features/profile/EditProfile";
import Employees from "./features/employees/Employees";
import Departments from "./features/departments/Departments";

import "bulma";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.scss";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="profile" />} />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          >
            <Route path=":employeeId" element={<Profile />} />
            <Route path=":employeeId/edit" elment={<EditProfile />} />
          </Route>
          <Route
            path="employees/*"
            element={
              <RequireAuth>
                <Employees />
              </RequireAuth>
            }
          />
          <Route
            path="departments/*"
            element={
              <RequireAuth>
                <Departments />
              </RequireAuth>
            }
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
