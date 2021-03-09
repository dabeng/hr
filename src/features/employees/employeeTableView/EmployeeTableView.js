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
} from '../employeesSlice';
import { EmployeeRow } from './EmployeeRow';

import styles from "./EmployeeTableView.module.scss";

export const EmployeeTableView = () => {
  let { path, url } = useRouteMatch();

  const dispatch = useDispatch();
  const orderedEmployeeIds = useSelector(selectEmployeeIds);

  const employeesStatus = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);

  useEffect(() => {
    if (employeesStatus === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [employeesStatus, dispatch]);

  return (
      <table className={"table " + styles.table_view_wrapper}>
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
          {employeesStatus === 'loading' &&
            <tr><td className="loader">Loading...</td></tr>
          }
          {employeesStatus === 'succeeded' &&
            orderedEmployeeIds.map(id => <EmployeeRow key={id} employeeId={id} />)
          }
          {employeesStatus === 'failed' &&
            <tr><td>{error}</td></tr>
          }
        </tbody>
      </table>
  );
};
