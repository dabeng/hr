import React, { useState } from "react";
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
  const [activeView, setActiveView] = useState('list-view');

  function openView(e) {
    setActiveView(e.target.href.split('/').slice(-1)[0] === 'employees' ?
      'list-view' : e.target.href.split('/').slice(-1)[0]);
  };

  return (
    <div>
      <div class="columns">
        <div class="column">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input class="input" type="text" placeholder="Name" />
              <span class="icon is-small is-right">
                <i class="fas fa-search"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="column"></div>
      </div>

      <div class="tabs is-right" onClick={openView}>
        <ul>
          <li className={`${activeView === 'list-view' ? 'is-active': ''}`}>
            <Link to={`${url}`}>list view</Link>
          </li>
          <li className={`${activeView === 'card-view' ? 'is-active': ''}`}>
            <Link to={`${url}/card-view`}>card view</Link>
          </li>
          <li className={`${activeView === 'chart-view' ? 'is-active': ''}`}>
            <Link to={`${url}/chart-view`}>chart view</Link>
          </li>
        </ul>
      </div>

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
