import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import { Profile } from "./features/profile/Profile";
import { Employees } from "./features/employees/Employees";
import { Departments } from "./features/departments/Departments";

import "bulma";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.scss";

function App() {
  return (
    <Router>
      <div>
        <div class="columns is-desktop">
          <div class="column is-offset-2 is-8">
            <nav
              class="navbar is-light"
              role="navigation"
              aria-label="main navigation"
            >
              <div class="navbar-brand">
                <a class="navbar-item" href="https://github.com/dabeng/hr">
                  <img
                    src="https://dabeng.github.io/OrgChart/img/logo.png"
                    width="28"
                    height="28"
                  />
                </a>

                <a
                  role="button"
                  class="navbar-burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarBasicExample"
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </a>
              </div>

              <div class="navbar-menu">
                <div class="navbar-start">
                  <NavLink
                    to="/"
                    className="navbar-item"
                    exact
                    activeClassName="is-active"
                  >
                    profile
                  </NavLink>
                  <NavLink
                    to="/employees"
                    className="navbar-item"
                    activeClassName="is-active"
                  >
                    Employees
                  </NavLink>
                  <NavLink
                    to="/departments"
                    className="navbar-item"
                    activeClassName="is-active"
                  >
                    Departments
                  </NavLink>
                </div>
              </div>

              <div class="navbar-end">
                <div class="navbar-item">
                  <div class="buttons">
                    <a class="button is-white">
                      <i class="fas fa-user-circle fa-2x"></i>
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div class="columns is-desktop">
          <div class="column is-offset-2 is-8">
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
        </div>
      </div>
    </Router>
  );
}

export default App;
