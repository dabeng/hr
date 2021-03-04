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
      <div class="columns">
  <div class="column">
  <div class="field">
  <p class="control has-icons-left has-icons-right">
    <input class="input" type="text" placeholder="Name"/>
    <span class="icon is-small is-right">
      <i class="fas fa-search"></i>
    </span>
  </p>
</div>
  </div>
  <div class="column">
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
  </div>
</div>


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
