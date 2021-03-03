import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export const EmployeeListView = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Employee List View</h2>
    </div>
  );
};
