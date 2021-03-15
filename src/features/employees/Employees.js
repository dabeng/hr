import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { EmployeeTableView } from "./employeeTableView/EmployeeTableView";
import { EmployeeCardView } from "./employeeCardView/EmployeeCardView";
import { EmployeeChartView } from "./employeeChartView/EmployeeChartView";

import {
  fetchEmployees,
  selectAllEmployees,
  selectEmployeeIds,
  selectEmployeeById,
} from "./employeesSlice";

export const Employees = () => {
  let { path, url } = useRouteMatch();
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState('table-view');

  const [keyword, setKeyword] = useState("");
  const PAGE_SIZE = 6;

  function openView(e) {
    if (e.target.nodeName === 'A') {
      setActiveView(e.target.href.split('/').slice(-1)[0] === 'employees' ?
        'table-view' : e.target.href.split('/').slice(-1)[0]);
    }
  };

  const updateKeyword = e => {
    setKeyword(e.target.value);
  };

  const search = e => {
    dispatch(fetchEmployees({page: 1, pageSize: PAGE_SIZE, keyword}));
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && keyword.trim().length) {
      search();
    }
  };


  return (
    <div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="Key Word" value={keyword} onChange={updateKeyword} onKeyPress={handleKeyPress}/>
              <span className="icon is-small is-right">
                <i className="fas fa-search"></i>
              </span>
            </p>
          </div>
        </div>
        <div className="column"></div>
      </div>

      <div className="tabs is-right" style={{ "margin": "-3rem 0 1rem" }} onClick={openView}>
        <ul>
          <li className={`${activeView === 'table-view' ? 'is-active': ''}`}>
            <Link to={`${url}`}>table view</Link>
          </li>
          <li className={`${activeView === 'card-view' ? 'is-active': ''}`}>
            <Link to={`${url}/card-view`}>card view</Link>
          </li>
          <li className={`${activeView === 'chart-view' ? 'is-active': ''}`}>
            <Link to={`${url}/chart-view`}>chart view</Link>
          </li>
        </ul>
      </div>

      <Switch>
        <Route exact path={path} >
          <EmployeeTableView keyword={keyword}/>
        </Route>
        <Route path={`${path}/card-view`}>
          <EmployeeCardView />
        </Route>
        <Route path={`${path}/chart-view`}>
          <EmployeeChartView />
        </Route>
      </Switch>
    </div>
  );
};
