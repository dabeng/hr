import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import { LoginPage } from "./features/core/LoginPage";
import { Profile } from "./features/profile/Profile";
import { Employees } from "./features/employees/Employees";
import { Departments } from "./features/departments/Departments";

import "bulma";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.scss";

function App() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleAccountMenu = e => {
    setShowMenu(prev => !prev);
  };

  return (
    <Router>
      <div>
        <div className="columns">
          <div className="column is-offset-2 is-8">
            <nav
              className="navbar is-light"
              role="navigation"
              aria-label="main navigation"
            >
              <div className="navbar-brand">
                <a className="navbar-item" href="https://github.com/dabeng/hr">
                  <img
                    src="https://dabeng.github.io/OrgChart/img/logo.png"
                    width="28"
                    height="28"
                  />
                </a>

                <a
                  role="button"
                  className="navbar-burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarBasicExample"
                >
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </a>
              </div>

              <div className="navbar-menu">
                <div className="navbar-start">
                  <NavLink
                    to="/profile"
                    className="navbar-item"
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

              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="buttons">
                    <div className={"dropdown is-right" + (showMenu ? " is-active" : "")}>
                      <div className="dropdown-trigger">
                        <button className="button" ariaHaspopup="true" ariaControls="account_menu" onClick={toggleAccountMenu}>
                          <span className="icon">
                            <i className="fas fa-user-circle" aria-hidden="true"></i>
                          </span>
                        </button>
                      </div>
                      <div className="dropdown-menu" id="account_menu" role="menu">
                        <div className="dropdown-content">
                          <div className="dropdown-item">
                            <p>Add the <code>is-right</code> modifier for a <strong>right-aligned</strong> dropdown.</p>
                          </div>
                        </div>
                     </div>
                   </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="columns">
          <div className="column is-offset-2 is-8">
            <Switch>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/">
                <Profile />
              </Route>
              <Route path="/profile">
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
