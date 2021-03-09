import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export const DepartmentTableView = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Department Table View</h2>
    </div>
  );
};
