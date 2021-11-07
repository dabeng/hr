import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Route,
  NavLink,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import clientAPI from './clientAPI';
import { showError, hideError, selectMessage } from "./errorSlice";
import { fetchUserBytoken, selectUser, clearUserState } from "./userSlice";

const NavigationBar = () => {
  return (
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

  );
};
export default NavigationBar;