import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export const EmployeeChartView = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Employee Chart View</h2>
    </div>
  );
};
