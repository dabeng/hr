import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

export const Profile = () => {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>My profile</h2>
    </div>
  );
};
