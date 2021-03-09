import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import {
  fetchEmployees,
  selectAllEmployees,
  selectEmployeeIds,
  selectEmployeeById,
} from "../employeesSlice";
import { fetchDepartments } from "../../departments/departmentsSlice";
import { EmployeeRow } from "./EmployeeRow";

import styles from "./EmployeeTableView.module.scss";

export const EmployeeTableView = () => {
  let { path, url } = useRouteMatch();

  const dispatch = useDispatch();
  const orderedEmployeeIds = useSelector(selectEmployeeIds);

  const employeesStatus = useSelector((state) => state.employees.status);
  const employeesError = useSelector((state) => state.employees.error);
  const departmentsStatus = useSelector((state) => state.departments.status);
  const departmentsError = useSelector((state) => state.departments.error);

  useEffect(() => {
    if (employeesStatus === "idle") {
      dispatch(fetchEmployees());
    }
    if (departmentsStatus === "idle") {
      dispatch(fetchDepartments());
    }
  }, [employeesStatus, departmentsStatus, dispatch]);

  return (
    <table
      className={"table is-striped is-hoverable " + styles.table_view_wrapper}
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Title</th>
          <th>Email</th>
          <th>Department</th>
          <th>Reports to</th>
          {/* <th>Reports</th> */}
          <th>Joined Date</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {employeesStatus === "loading" && (
          <tr>
            <td className="loader">Loading...</td>
          </tr>
        )}
        {employeesStatus === "succeeded" &&
          departmentsStatus === "succeeded" &&
          orderedEmployeeIds.map((id) => (
            <EmployeeRow key={id} employeeId={id} />
          ))}
        {employeesStatus === "failed" && (
          <tr>
            <td>{employeesError}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
