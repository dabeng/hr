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

  const status = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);
  const total = useSelector((state) => state.employees.total);

  let isNextBtnDisabled = currentPage * 10 >= total;
  let isPrevBtnDisabled = currentPage === 1;

  useEffect(() => {
    // if (status === "idle") {
      dispatch(fetchEmployees(currentPage));
    // }
  }, [dispatch, currentPage]);

  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const nextPage = (e) => {
    setCurrentPage(currentPage + 1);
  };

  const gotoPage = (e) => {
    setCurrentPage(parseInt(e.target.textContent));
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
          {status === "loading" && (
            <tr>
              <td className="loader">Loading...</td>
            </tr>
          )}
          {status === "succeeded" &&
            orderedEmployeeIds.map((id) => (
              <EmployeeRow key={id} employeeId={id} />
            ))}
          {status === "failed" && (
            <tr>
              <td>{error}</td>
            </tr>
          )}
        </tbody>
      </table>
      <nav
        className="pagination is-small"
        role="navigation"
        aria-label="pagination"
      >
        <a className="pagination-previous" onClick={!isPrevBtnDisabled ? previousPage : undefined} disabled={isPrevBtnDisabled}>Previous</a>
        <a className="pagination-next" onClick={!isNextBtnDisabled ? nextPage : undefined} disabled={isNextBtnDisabled}>Next page</a>
        <ul class="pagination-list">
          {status === "succeeded" &&
            Array(Math.ceil(total/10)).fill(0).map((v, index) => (
              <li key={index}>
                <a className={"pagination-link" + (index + 1 === currentPage ? " is-current" : "")} aria-label={"Goto page " + (index + 1)} onClick={gotoPage}>
                  {index + 1}
                </a>
            </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};
