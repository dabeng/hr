import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { EmployeeTableView } from "./employeeTableView/EmployeeTableView";
import { EmployeeCardView } from "./employeeCardView/EmployeeCardView";
import { EmployeeChartView } from "./employeeChartView/EmployeeChartView";

import {
  fetchEmployees,
} from "./employeesSlice";

const Employees = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeView, setActiveView] = useState(location.pathname === '/employees' ? 'table-view' : location.pathname.split('/').slice(-1)[0]);

  const [keyword, setKeyword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const PAGE_SIZE = 6;

  function openView(e) {
    if (e.target.nodeName === 'A') {
      const targetView = e.target.href.split('/').slice(-1)[0];
      setActiveView(targetView === 'employees' ? 'table-view' : e.target.href.split('/').slice(-1)[0]);
      setIsDisabled(targetView === 'chart-view');
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
              <input disabled={isDisabled ? true : undefined} className="input" type="text" placeholder="Key Word" value={keyword} onChange={updateKeyword} onKeyPress={handleKeyPress}/>
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
            <Link to="">table view</Link>
          </li>
          <li className={`${activeView === 'card-view' ? 'is-active': ''}`}>
            <Link to="card-view">card view</Link>
          </li>
          <li className={`${activeView === 'chart-view' ? 'is-active': ''}`}>
            <Link to="chart-view">chart view</Link>
          </li>
        </ul>
      </div>

      <Routes>
        <Route index element={<EmployeeTableView keyword={keyword} />} />
        <Route path="card-view" element={<EmployeeCardView keyword={keyword} />} />
        <Route path="chart-view" element={<EmployeeChartView />} />
      </Routes>
    </div>
  );
};

export default Employees;
