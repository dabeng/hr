import React, { useState, useEffect } from "react";
import {
  NavLink,
  Outlet,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { hideError, selectMessage } from "./errorSlice";
import { selectUser, logoutUser } from "./userSlice";
import TokenService from "./token.service";

import styles from "./Layout.module.scss";

const Layout = () => {
  const dispatch = useDispatch();

  const errorMessage = useSelector(selectMessage);
  const { name: username, email } = useSelector(selectUser);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);

  const closeErrorNoti = e => {
    dispatch(hideError());
  };

  const toggleAccountMenu = e => {
    setShowAccountMenu(prev => !prev);
  };

  const toggleNavMenu = e => {
    setShowNavMenu(prev => !prev);
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser(TokenService.getLocalRefreshToken()));
      // 得把布局用的临时状态恢复初始值
      setShowAccountMenu(false);
      setShowNavMenu(false);
    } catch (err) {
      console.log(`[system error] ${err}`);
    } finally { // 只要用户触发登陆操作，就强制退出， 清除当前登录用户的持久化信息, 不论server端是否处理顺利
      TokenService.removeUser();
    }
  };

  // useEffect(() => {
  //   const handleUnload = () => {
  //     TokenService.removeUser();
  //   };
  //   window.addEventListener("unload", handleUnload);
  //   return () => window.removeEventListener("unload", handleUnload);
  // }, []);

  return (
    <>
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
        <div className="column is-offset-1 is-10">
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
                className={`navbar-burger${showNavMenu ? " is-active" : ""}`}
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
                onClick={toggleNavMenu}
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
            </div>
            <div className={`navbar-menu${showNavMenu ? " is-active" : ""}`}>
              <div className="navbar-start">
                <NavLink
                  to="profile"
                  className={({ isActive }) => `navbar-item${isActive ? ' is-active' : ''}`}
                >
                  profile
                </NavLink>
                <NavLink
                  to="employees"
                  className={({ isActive }) => `navbar-item${isActive ? ' is-active' : ''}`}
                >
                  Employees
                </NavLink>
                <NavLink
                  to="departments"
                  className={({ isActive }) => `navbar-item ${isActive ? 'is-active' : ''}`}
                >
                  Departments
                </NavLink>
                <NavLink
                  to="calendar"
                  className={({ isActive }) => `navbar-item ${isActive ? 'is-active' : ''}`}
                >
                  Calendar
                </NavLink>
                <NavLink
                  to="goals"
                  className={({ isActive }) => `navbar-item ${isActive ? 'is-active' : ''}`}
                >
                  Goals
                </NavLink>
              </div>
              <div className="navbar-end">
                <div className="navbar-item">
                  <div className="buttons">
                    {username &&
                      <div
                        className={
                          `dropdown${showAccountMenu ? " is-active" : ""}${showNavMenu ? " is-left" : " is-right"}`
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
                    }
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="columns">
        <div className="column is-offset-1 is-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
