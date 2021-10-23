import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  useHistory,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import clientAPI from './clientAPI';
import { showError, hideError, selectMessage } from "./errorSlice";
import { fetchUserBytoken, selectUser, clearUserState } from "./userSlice";
import { Profile } from "../profile/Profile";
import { EditProfile } from "../profile/EditProfile";
import { Employees } from "../employees/Employees";
import { Departments } from "../departments/Departments";

import styles from "./MainPage.module.scss";

const MainPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const errorMessage = useSelector(selectMessage);
  const { name: username, email, status } = useSelector(selectUser);
  const [showMenu, setShowMenu] = useState(false);

  const closeErrorNoti = e => {
    dispatch(hideError());
  };

  const toggleAccountMenu = e => {
    setShowMenu(prev => !prev);
  };

  const logout = async () => {
    try {
      const response = await clientAPI.logoutUser(localStorage.getItem('refreshToken'));

      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(clearUserState());
        history.push('/login');
      } else {
        dispatch(showError("failed to logout"));
      }
    } catch (err) {
      dispatch(showError("failed to logout"));
    }
  };

  useEffect(() => {
    // render account menu with user info
    if (localStorage.getItem('accessToken') && !username) {
      dispatch(fetchUserBytoken());
    }
  }, [dispatch, username]);

  useEffect(() => {
    if (status === "failed") {
      dispatch(clearUserState());
      history.push('/login');
    }
  }, [dispatch, history, status]);

  return (
    <>
      {!localStorage.getItem("accessToken")
        ? <Redirect to="/login" />
        : <Router> {/* protected routes */}
            {errorMessage && /* golal error message */
              <div className="columns">
                <div className="column is-offset-4 is-4" style={{"position": "absolute"}}>
                    <div className={"notification is-danger is-light " + styles.global_error}>
                      <button className="delete" onClick={closeErrorNoti}></button>
                      {errorMessage}
                    </div>
                </div>
              </div>
            }
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
                      alt="logo"
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
              { username && // 这里没有用status===“succeeded”，是因为触发fetchUserByToken，成功获取登陆用户信息后，status会恢复初始值“idle”
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/profile" />
                  </Route>
                  <Route exact path="/profile">
                    <Profile />
                  </Route>
                  <Route exact path="/profile/:employeeId">
                    <Profile />
                  </Route>
                  <Route exact path="/profile/:employeeId/edit">
                    <EditProfile />
                  </Route>
                  <Route path="/employees">
                    <Employees />
                  </Route>
                  <Route path="/departments">
                    <Departments />
                  </Route>
                </Switch>
              }
              </div>
            </div>
          </Router>
      }
    </>
  );
};
export default MainPage;
