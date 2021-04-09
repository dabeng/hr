import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchEmployees,
  selectEmployeeIds,
} from "../employeesSlice";
import {
  selectEmployee,
} from "../employeeSlice";
import { selectUser } from "../../core/userSlice";
import { EmployeeRow } from "./EmployeeRow";

import styles from "./EmployeeTableView.module.scss";

export const EmployeeTableView = ({keyword}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  const { id: userId } = useSelector(selectUser);
  const activeEmployee = useSelector(selectEmployee);
  const orderedEmployeeIds = useSelector(selectEmployeeIds);

  const status = useSelector((state) => {
    return state.employees.status
  });
  const error = useSelector((state) => state.employees.error);
  const total = useSelector((state) => state.employees.total);

  const PAGE_SIZE = 6;

  let isNextBtnDisabled = currentPage * PAGE_SIZE >= total;
  let isPrevBtnDisabled = currentPage === 1;
  let activeEmployeeId = activeEmployee.value ? activeEmployee.value.id : userId;

  useEffect(() => {
    // if (status === "idle") {
    dispatch(fetchEmployees({
      page: currentPage,
      pageSize: PAGE_SIZE,
      keyword: keyword,
      activeEmployee: activeEmployeeId
    }));
    // }
  }, [dispatch, currentPage, keyword, activeEmployeeId]);

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
              <td colSpan="6" style={{"textAlign": "center"}}>
                <i className={"fas fa-circle-notch fa-spin fa-4x " + styles.spinner}></i>
              </td>
            </tr>
          )}
          {status === "succeeded" && (
            orderedEmployeeIds.length
            ? orderedEmployeeIds.map(id => (
                <EmployeeRow key={id} employeeId={id} />
              ))
            : <tr>
                <td colSpan="6" style={{"textAlign": "center"}}>No results found</td>
              </tr>
          )}
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
        <a
          className="pagination-previous"
          onClick={!isPrevBtnDisabled ? previousPage : undefined}
          disabled={isPrevBtnDisabled}
        >
          Previous
        </a>
        <a
          className="pagination-next"
          onClick={!isNextBtnDisabled ? nextPage : undefined}
          disabled={isNextBtnDisabled}
        >
          Next page
        </a>
        <ul className="pagination-list">
          {status === "succeeded" &&
            Array(Math.ceil(total / PAGE_SIZE))
              .fill(0)
              .map((v, index) => (
                <li key={index}>
                  <a
                    className={
                      "pagination-link" +
                      (index + 1 === currentPage ? " is-current" : "")
                    }
                    aria-label={"Goto page " + (index + 1)}
                    aria-current={index + 1 === currentPage ? "page" : undefined}
                    onClick={gotoPage}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
        </ul>
      </nav>
    </div>
  );
};
