import React, { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const orderedEmployeeIds = useSelector(selectEmployeeIds);

  const employeesStatus = useSelector((state) => state.employees.status);
  const employeesError = useSelector((state) => state.employees.error);
  const departmentsStatus = useSelector((state) => state.departments.status);
  const departmentsError = useSelector((state) => state.departments.error);

  useEffect(() => {
    // if (employeesStatus === "idle") {
      dispatch(fetchEmployees(currentPage));
    // }
    if (departmentsStatus === "idle") {
      dispatch(fetchDepartments());
    }
  }, [dispatch, currentPage]);

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <table
        className={
          "table is-striped is-hoverable is-fullwidth " +
          styles.table_view_wrapper
        }
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Email</th>
            <th>Department</th>
            <th>Reports to</th>
            <th>Joined Date</th>
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
      <nav
        className="pagination is-small"
        role="navigation"
        aria-label="pagination"
      >
        <a className="pagination-previous" onClick={previousPage}>Previous</a>
        <a className="pagination-next" onClick={nextPage}>Next page</a>
        <ul class="pagination-list">
          <li>
            <a class="pagination-link" aria-label="Goto page 1">
              1
            </a>
          </li>
          <li>
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li>
            <a class="pagination-link" aria-label="Goto page 45">
              45
            </a>
          </li>
          <li>
            <a
              class="pagination-link is-current"
              aria-label="Page 46"
              aria-current="page"
            >
              46
            </a>
          </li>
          <li>
            <a class="pagination-link" aria-label="Goto page 47">
              47
            </a>
          </li>
          <li>
            <span class="pagination-ellipsis">&hellip;</span>
          </li>
          <li>
            <a class="pagination-link" aria-label="Goto page 86">
              86
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
