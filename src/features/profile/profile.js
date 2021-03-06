import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import styles from "./Profile.module.scss";

export const Profile = () => {
  let { path, url } = useRouteMatch();

  return (
    <div className={styles.wrapper}>
      <div class="field">
        <label class="label">Name</label>
        <div class="control">
          <p className="has-text-dark">my name</p>
          {/* <input class="input" type="text" placeholder="Text input"/> */}
        </div>
      </div>
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <p className="has-text-dark">my title</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <p className="has-text-dark">my email</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Department</label>
        <div class="control">
          <p className="has-text-dark">my department</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Reports to</label>
        <div class="control">
          <p className="has-text-dark">my leader</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Reports</label>
        <div class="control">
          <p className="has-text-dark">my leader</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Joined Date</label>
        <div class="control">
          <p className="has-text-dark">my joined date</p>
        </div>
      </div>
      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <p className="has-text-dark">my description</p>
        </div>
      </div>
    </div>
  );
};
