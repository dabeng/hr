import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import { Profile } from "./features/profile/profile";
import { Employees } from "./features/employees/Employees";
import { Departments } from "./features/departments/Departments";

import "bulma";
import "./App.scss";

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">profile</Link>
          </li>
          <li>
            <Link to="/employees">Employees</Link>
          </li>
          <li>
            <Link to="/departments">Departments</Link>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Profile />
          </Route>
          <Route path="/employees">
            <Employees />
          </Route>
          <Route path="/departments">
            <Departments />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

