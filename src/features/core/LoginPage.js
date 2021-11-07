import React, { useState, useEffect } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  loginUser,
  selectUser,
  clearUserState
} from "./userSlice";

import styles from "./LoginPage.module.scss";


const LoginPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {status, error } = useSelector(selectUser);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const updateEmail = e => {
    setEmail(e.target.value);
  };

  const updatePassword = e => {
    setPassword(e.target.value);
  };

  const validateFields = e => {
    e.preventDefault();
    let valid = true;
    if (!email.trim()) {
      setEmailError("email is required");
      valid = false;
    }
    if (!/.+@tongyong.com/.test(email.trim())) {
      setEmailError("Please provide only a TongYong corporate e-mail address");
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError("password is required");
      valid = false;
    }
    if (valid) {
      login();
    }
  };

  const login = () => {
    dispatch(loginUser({email, password}));
  };

  const closeErrorNoti = e => {
    dispatch(clearUserState());
  };

  // const error = useSelector(state => state.employee.error);
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(clearUserState());
      navigate('/');
    }
  }, [dispatch, navigate, status]);

  return (
    <>
      <div className="columns">
        <div className="column is-offset-4 is-4" style={{"height": "5rem"}}>
          {error &&
            <div data-testid="error_global" className="notification is-danger is-light">
              <button className="delete" onClick={closeErrorNoti}></button>
              {error.message}
            </div>
          }
        </div>
      </div>
      <div className="columns" style={{"position": "relative"}}>
        <div className="column is-offset-4 is-4">
          <form className="form_login" onSubmit={validateFields}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input data-testid="field_email" className="input" type="text" placeholder="email" onChange={updateEmail}/>
              </div>
              {emailError &&
                <p data-testid="error_email" className="help is-danger">{emailError}</p>
              }
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input data-testid="field_password" className="input" type="password" placeholder="password" onChange={updatePassword}/>
              </div>
              {passwordError &&
                <p data-testid="error_password" className="help is-danger">{passwordError}</p>
              }
            </div>
            <div className="field">
              <div className="control">
                <button data-testid="button_submit" className="button is-fullwidth is-primary">Log In</button>
              </div>
            </div>
          </form>
          {status === "loading" && (
            <>
              <div className={styles.mask}></div>
              <i className={"fas fa-circle-notch fa-spin fa-4x " + styles.spinner}></i>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
