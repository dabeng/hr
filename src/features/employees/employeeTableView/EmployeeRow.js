import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Link,
} from "react-router-dom";

import {
  selectEmployeeById,
} from '../employeesSlice';

export const EmployeeRow = ({ employeeId }) => {
  const employee = useSelector(state => selectEmployeeById(state, employeeId));

  return (
    <tr key={employee.id}>
      <td>
        <Link to={`/employees/${employee.id}`}>
          {employee.name}
        </Link>
      </td>
      <td>{employee.title}</td>
      <td>{employee.email}</td>
      <td>{employee.department}</td>
      <td>{employee.leader}</td>
      <td>{employee.joined_date}</td>
      <td>{employee.description}</td>
    </tr>
  );
}