import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { DepartmentListView } from "./DepartmentListView";
import { DepartmentCardView } from "./DepartmentCardView";
import { DepartmentChartView } from "./DepartmentChartView";

export const Departments = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Departments</h2>
      <ul>
        <li>
          <Link to={`${url}`}>list view</Link>
        </li>
        <li>
          <Link to={`${url}/card-view`}>card view</Link>
        </li>
        <li>
          <Link to={`${url}/chart-view`}>chart view</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path={path}>
          <DepartmentListView />
        </Route>
        <Route path={`${path}/card-view`}>
          <DepartmentCardView />
        </Route>
        <Route path={`${path}/chart-view`}>
          <DepartmentChartView />
        </Route>
      </Switch>
    </div>
  );
};
