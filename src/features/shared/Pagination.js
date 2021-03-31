import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchEmployees,
  selectAllEmployees,
  selectEmployeeIds,
  selectEmployeeById,
} from "../employees/employeesSlice";


export const Pagination = ({keyword, activeEmployeeId}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const status = useSelector((state) => state.employees.status);
  const dispatch = useDispatch();
  const total = useSelector((state) => state.employees.total);

  const PAGE_SIZE = 6;

  let isNextBtnDisabled = currentPage * PAGE_SIZE >= total;
  let isPrevBtnDisabled = currentPage === 1;

  useEffect(() => {
    // if (status === "idle") {
    dispatch(fetchEmployees({page: currentPage, pageSize: PAGE_SIZE, keyword, activeEmployee: activeEmployeeId}));
    // }
  }, [currentPage, keyword, activeEmployeeId]);

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
  );
};