import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export const DepartmentChartView = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Department Chart View</h2>
    </div>
  );
};
