import React, { useState, useEffect } from "react";
import {
  useNavigate,
  NavLink,
  Outlet,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import clientAPI from './clientAPI';
import { showError, hideError, selectMessage } from "./errorSlice";
import { fetchUserBytoken, selectUser, clearUserState } from "./userSlice";


import styles from "./Layout.module.scss";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        navigate('/login');
      } else {
        dispatch(showError("failed to logout"));
      }
    } catch (err) {
      dispatch(showError("failed to logout"));
    }
  };

  useEffect(() => {
    // 渲染当前页面，却没有获得登陆账户信息的时候（比方说刷新页面或在浏览器地址栏中粘贴URL直接跳转），通过token来获得账户信息
    if (localStorage.getItem('accessToken') && !username) {
      dispatch(fetchUserBytoken());
    }
  }, [dispatch, username]);

  useEffect(() => {
    // 如果用token获取登录账户信息失败了（比如token过期了），那就跳转到登录页面
    if (status === "failed") {
      dispatch(clearUserState());
      navigate('/login');
    }
  }, [dispatch, navigate, status]);

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
          {/* <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:employeeId" element={<Profile />} />
            <Route path="profile/:employeeId/edit" element={<EditProfile />} />
            <Route path="employees" element={<Employees />} />
            <Route path="departments" element={<Departments />} />
          </Routes> */}
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
