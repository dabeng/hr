import React from "react";
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
import { EmployeeCard } from "./EmployeeCard";
import { Pagination } from "../../shared/Pagination";

import styles from "./EmployeeCardView.module.scss";

export const EmployeeCardView = () => {
  let { path, url } = useRouteMatch();

  const orderedEmployeeIds = useSelector(selectEmployeeIds);

  const status = useSelector((state) => state.employees.status);
  const error = useSelector((state) => state.employees.error);

  return (
    <div>
      {status === "loading" &&
        <div style={{"textAlign": "center"}}>
          <i className={"fas fa-circle-notch fa-spin fa-4x " + styles.spinner}></i>
        </div>
      }
      {status === "succeeded" && (
        orderedEmployeeIds.length > 0
          ? <div className={styles.cards_wrapper}>
              {orderedEmployeeIds.map(id => (
                <EmployeeCard key={id} employeeId={id} />
              ))}
            </div>
          : <h3 style={{"textAlign": "center"}}>No results found</h3>
        )
      }
        <Pagination />
      {status === "failed" && (
        <h3>{error}</h3>
      )}
    </div>
  );
};
