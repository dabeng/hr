import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./features/core/Layout";
import LoginPage from "./features/core/LoginPage";
import NotFoundPage from "./features/core/NotFoundPage";
import RequireAuth from "./features/core/RequireAuth";

import "bulma";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.scss";

const Profile = lazy(() => import('./features/profile/Profile'));
const EditProfile = lazy(() => import('./features/profile/EditProfile'));
const Employees = lazy(() => import('./features/employees/Employees'));
const Departments = lazy(() => import('./features/departments/Departments'));



function App() {

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
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
            />
            <Route
              path="profile/:employeeId"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="profile/:employeeId/edit"
              element={
                <RequireAuth>
                  <EditProfile />
                </RequireAuth>
              }
            />
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
      </Suspense>
    </Router>
  );
}

export default App;
