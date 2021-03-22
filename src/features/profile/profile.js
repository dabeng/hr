import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectUser,
} from "../core/userSlice";
import {
  fetchEmployee,
  setEmployee,
  selectEmployee,
} from "../employees/employeeSlice";
import {
  selectEmployeeById,
} from "../employees/employeesSlice";

import { ProfileForm } from "./ProfileForm";

import styles from "./Profile.module.scss";


export const Profile = () => {
  let { path, url } = useRouteMatch();
  const dispatch = useDispatch();

  const { id: userId } = useSelector(selectUser);
  const employeeId = new URLSearchParams(useLocation().search).get("employeeId");
  const employees = useSelector(state => state.employees);
  const employee = useSelector(employees.ids.length && employeeId ? state => selectEmployeeById(state, employeeId) : selectEmployee);

  useEffect(() => {
    if (employees.ids.length && employeeId) {
      dispatch(setEmployee(employee));
    } else if (employeeId) {
      dispatch(fetchEmployee(employeeId));
    } else if (userId) {
      dispatch(fetchEmployee(userId));
    }
  }, [dispatch, employees, employeeId, userId]);

  return (
    <div className="columns">
      <div className="column is-4">
      <i className="fas fa-address-card fa-10x"></i>
      </div>
      <div className={"column is-8 " + styles.form_column}>
      {employee && employee.status === "loading" && (
        <i className={"fas fa-circle-notch fa-spin fa-4x " + styles.spinner}></i>
      )}
      {employees.ids.length > 0 && employeeId && (
        <ProfileForm employee={employee}/>
      )}
      {employee.status === "succeeded" && (
        <ProfileForm employee={employee.value}/>
      )}
      </div>
    </div>
  );
};
