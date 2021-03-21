import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import { LoginPage } from "./features/core/LoginPage";
import { MainPage } from "./features/core/MainPage";


import "bulma";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.scss";

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
        {/* <Route exact path="/">
          <Profile />
        </Route> */}
      </Switch>
    </Router>
  );
}

export default App;
