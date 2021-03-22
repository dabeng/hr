import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useHistory,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
  Redirect
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { loginUser, fetchUserBytoken, selectUser, clearUserState } from "./userSlice";
import { Profile } from "../profile/Profile";
import { Employees } from "../employees/Employees";
import { Departments } from "../departments/Departments";

export const MainPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { name: username, email, status } = useSelector(selectUser);
  const [showMenu, setShowMenu] = useState(false);

  const toggleAccountMenu = e => {
    setShowMenu(prev => !prev);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    dispatch(clearUserState());
    history.push('/login');
  };

  useEffect(() => {
    if (!username) { // 如果当前登陆用户信息不存在，则根据浏览器里的缓存token去服务器端取一次
      dispatch(fetchUserBytoken(localStorage.getItem('accessToken')));
    }
  }, []);

  useEffect(() => {
    if (status === "failed") {
      dispatch(clearUserState());
      history.push('/login');
    }
  }, [status]);

  return (
    <>
      {!localStorage.getItem("accessToken")
        ? <Redirect to="/login" />
        : <Router>
            <div className="columns">
            <div className="column is-offset-2 is-8">
              <nav
                className="navbar is-light"
                role="navigation"
                aria-label="main navigation"
              >
                <div className="navbar-brand">
                  <a
                    className="navbar-item"
                    href="https://github.com/dabeng/hr"
                  >
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
                      <div
                        className={
                          "dropdown is-right" + (showMenu ? " is-active" : "")
                        }
                      >
                        <div className="dropdown-trigger">
                          <button
                            className="button"
                            aria-haspopup="true"
                            aria-controls="account_menu"
                            onClick={toggleAccountMenu}
                          >
                            <span className="icon">
                              <i
                                className="fas fa-user-circle"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </button>
                        </div>
                        <div
                          className="dropdown-menu"
                          id="account_menu"
                          role="menu"
                        >
                          <div className="dropdown-content">
                            <div className="dropdown-item" style={{"textAlign": "center"}}>
                              <i className="fas fa-user-circle fa-4x"></i>
                              <h6 className="title is-6">{username}</h6>
                              <h6 className="subtitle is-6">{email}</h6>
                            </div>
                            <hr className="dropdown-divider"/>
                            <div className="dropdown-item">
                              <button className="button is-fullwidth is-primary" onClick={logout}>Log Out</button>
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
                  <Route exact path="/">
                    <Redirect to="/profile" />
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
          </Router>
      }
    </>
  );
};
