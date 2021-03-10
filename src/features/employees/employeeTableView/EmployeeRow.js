import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Link,
} from "react-router-dom";

import {
  selectEmployeeById,
} from '../employeesSlice';
import {
  selectDepartmentById,
} from '../../departments/departmentsSlice';

export const EmployeeRow = ({ employeeId }) => {
  const employee = useSelector(state => selectEmployeeById(state, employeeId));
  const department = useSelector(state => selectDepartmentById(state, employee.department));

  return (
    <tr key={employee.id}>
      <td>
        <Link to={`/employees/${employee.id}`}>
          {employee.name}
        </Link>
      </td>
      <td>{employee.title}</td>
      <td>{employee.email}</td>
      <td>{department.name}</td>
      <td>{employee.superiorName}</td>
      <td>{employee.joined_date}</td>
    </tr>
  );
}