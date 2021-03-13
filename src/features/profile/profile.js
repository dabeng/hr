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
  fetchEmployee,
  setEmployee,
  selectEmployee,
} from "../employees/employeeSlice";
import {
  selectEmployeeById,
} from "../employees/employeesSlice";

import styles from "./Profile.module.scss";


export const Profile = () => {
  let { path, url } = useRouteMatch();
  const dispatch = useDispatch();

  const employeeId = new URLSearchParams(useLocation().search).get("employeeId");
  
  const employees = useSelector(state => state.employees);

  const employee = useSelector(employees.ids.length ? state => selectEmployeeById(state, employeeId) : selectEmployee);

    // const status = useSelector(state => state.employee.status);
    // const error = useSelector(state => state.employee.error);
    useEffect(() => {
      // if (status === "idle") {
      // dispatch(fetchEmployee(employeeId));
      // }
      if (employees.ids.length) {
        dispatch(setEmployee(employee));
      } else {
        dispatch(fetchEmployee(employeeId));
      }
    }, [dispatch, employees, employeeId]);
  

  return (
    <div class="columns">
      <div class="column is-4">
      <i class="fas fa-address-card fa-10x"></i>
      </div>
      <div class="column is-8">
      {employee && employee.status === "loading" && (
        <i class="fas fa-circle-notch fa-spin fa-4x"></i>
      )}
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <p className="has-text-dark">{
            employees.ids.length
            ? employee.name
            : (employee.status === "succeeded"
              ? employee.value.name
              : "")
          }</p>
          {/* <input class="input" type="text" placeholder="Text input"/> */}
        </div>
      </div>
      {/* <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <p className="has-text-dark">{employee.title}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <p className="has-text-dark">{employee.email}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Department</label>
        <div class="control">
          <p className="has-text-dark">{employee.department_name}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Reports to</label>
        <div class="control">
          <p className="has-text-dark">{employee.superior_name}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Reports</label>
        <div class="control">
          <p className="has-text-dark">
          {employee.inferior_names &&  employee.inferior_names.length &&
            employee.inferior_names.map((name, index, names) => (
              <span>{name + (index < names.length - 1 ? ",\u00A0\u00A0" : "")}</span>
            ))}
          </p>
        </div>
      </div>
      <div class="field">
        <label class="label">Joined Date</label>
        <div class="control">
          <p className="has-text-dark">{employee.joined_date}</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <p className="has-text-dark">{employee.description}</p>
        </div>
      </div> */}
      </div>
    </div>
  );
};
