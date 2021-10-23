import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import "bulma";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.scss";

const LoginPage = lazy(() => import("./features/core/LoginPage"));
const MainPage = lazy(() => import("./features/core/MainPage"));

function App() {

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
