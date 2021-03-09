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

const EmployeeRow = ({ employeeId }) => {
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
    <div>
      <table class="table">
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
    </div>
  );
};
