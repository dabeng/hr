import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { MainPage } from "./features/core/MainPage";
import { LoginPage } from "./features/core/LoginPage";
import NotFoundPage from "./features/core/NotFoundPage";

import "bulma";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.scss";

function App() {

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
