import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export const DepartmentCardView = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Department Card View</h2>
    </div>
  );
};
