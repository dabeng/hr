import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectEmployeeById } from "../employeesSlice";

import styles from "./EmployeeCard.module.scss";

export const EmployeeCard = ({ employeeId }) => {
  const employee = useSelector((state) =>
    selectEmployeeById(state, employeeId)
  );

  return (
    <div key={employee.id} className={"card " + styles.card}>
      <div className="card-image">
        <figure className="image" style={{ textAlign: "center" }}>
          <i className="fas fa-user-circle fa-4x"></i>
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure
              className="image is-48x48"
              style={{ lineHeight: "60px", textAlign: "center" }}
            >
              <i className="far fa-user fa-2x"></i>
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-4">
              <Link to={`/profile?employeeId=${employee.id}`}>
                {employee.name}
              </Link>
            </p>
            <p className="subtitle is-6">{employee.email}</p>
          </div>
        </div>
        <div className="content">
          <div>
            <Link to={`/profile?employeeId=${employee.department}`}>
              {employee.department_name}
            </Link>
          </div>
          <div>reports to:&nbsp;
            <Link to={`/profile?employeeId=${employee.superior}`}>
              {employee.superior_name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
