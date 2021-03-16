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

import styles from "./ProfileForm.module.scss";

export const ProfileForm = (props) => {
  const employee = props.employee;

  return (
    <>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <p className="has-text-dark">{employee.name}</p>
          {/* <input class="input" type="text" placeholder="Text input"/> */}
        </div>
      </div>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <p className="has-text-dark">{employee.title}</p>
        </div>
      </div>
      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <p className="has-text-dark">{employee.email}</p>
        </div>
      </div>
      <div className="field">
        <label className="label">Department</label>
        <div className="control">
          <p className="has-text-dark">{employee.department_name}</p>
        </div>
      </div>
      <div className="field">
        <label className="label">Reports to</label>
        <div className="control">
          <p className="has-text-dark">{employee.superior_name}</p>
        </div>
      </div>
      <div className="field">
        <label className="label">Reports</label>
        <div className="control">
          <p className="has-text-dark">
          {employee.inferior_names &&  employee.inferior_names.length &&
            employee.inferior_names.map((name, index, names) => (
              <span key={index}>{name + (index < names.length - 1 ? ",\u00A0\u00A0" : "")}</span>
            ))}
          </p>
        </div>
      </div>
      <div className="field">
        <label className="label">Joined Date</label>
        <div className="control">
          <p className="has-text-dark">{employee.joined_date}</p>
        </div>
      </div>
      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <p className="has-text-dark">{employee.description}</p>
        </div>
      </div>
    </>
  );
};
