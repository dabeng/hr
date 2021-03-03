import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { EmployeeListView } from "./EmployeeListView";
import { EmployeeCardView } from "./EmployeeCardView";
import { EmployeeChartView } from "./EmployeeChartView";

export const Employees = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Employees</h2>
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
          <EmployeeListView />
        </Route>
        <Route path={`${path}/card-view`}>
          <EmployeeCardView />
        </Route>
        <Route path={`${path}/chart-view`}>
          <EmployeeChartView />
        </Route>
      </Switch>
    </div>
  );
};
