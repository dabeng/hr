import React from "react";
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
  selectEmployeeById,
} from "../employees/employeesSlice";

import styles from "./Profile.module.scss";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Profile = () => {
  let { path, url } = useRouteMatch();

  const employeeId = new URLSearchParams(useLocation().search).get("employeeId");
  

  const employee = useSelector((state) => selectEmployeeById(state, employeeId));

  return (
    <div class="columns">
      <div class="column is-4">
      <i class="fas fa-address-card fa-10x"></i>
      </div>
      <div class="column is-8">
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <p className="has-text-dark">{employee.name}</p>
          {/* <input class="input" type="text" placeholder="Text input"/> */}
        </div>
      </div>
      <div class="field">
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
      </div>
      </div>
    </div>
  );
};
