import React, { useState, useEffect } from "react";
import {
  useHistory,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  loginUser,
  selectUser,
  clearUserState
} from "./userSlice";

import styles from "./LoginPage.module.scss";


export const LoginPage = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const {status, error } = useSelector(selectUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateEmail = e => {
    setEmail(e.target.value);
  };

  const updatePassword = e => {
    setPassword(e.target.value);
  };

  const login = e => {
    e.preventDefault();
    dispatch(loginUser({email, password}));
  };

  const closeErrorNoti = e => {
    dispatch(clearUserState());
  };

  // const error = useSelector(state => state.employee.error);
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(clearUserState());
      history.push('/');
    }
  }, [dispatch, history, status]);

  return (
    <>
      <div className="columns">
        <div className="column is-offset-4 is-4" style={{"height": "5rem"}}>
          {error &&
            <div className="notification is-danger is-light">
              <button className="delete" onClick={closeErrorNoti}></button>
              {error.message}
            </div>
          }
        </div>
      </div>
      <div className="columns" style={{"position": "relative"}}>
        <div className="column is-offset-4 is-4">
          <form onSubmit={login}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control">
                <input className="input" type="text" placeholder="email" onChange={updateEmail}/>
              </div>
            </div>
            <div className="field">
              <label className="label">Password</label>
              <div className="control">
                <input className="input" type="text" placeholder="password" onChange={updatePassword}/>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-fullwidth is-primary">Log In</button>
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
