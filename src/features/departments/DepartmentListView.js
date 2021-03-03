import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export const DepartmentListView = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Department List View</h2>
    </div>
  );
};
