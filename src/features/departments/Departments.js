import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { DepartmentTableView } from "./DepartmentTableView/DepartmentTableView";
import { DepartmentCardView } from "./DepartmentCardView/DepartmentCardView";
import { DepartmentChartView } from "./DepartmentChartView/DepartmentChartView";

const Departments = () => {
  const [activeView, setActiveView] = useState('table-view');

  function openView(e) {
    if (e.target.nodeName === 'A') {
      setActiveView(e.target.href.split('/').slice(-1)[0] === 'departments' ?
        'table-view' : e.target.href.split('/').slice(-1)[0]);
    }
  };

  return (
    <div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input className="input" type="text" placeholder="Name" />
              <span className="icon is-small is-right">
                <i className="fas fa-search"></i>
              </span>
            </p>
          </div>
        </div>
        <div className="column"></div>
      </div>

      <div className="tabs is-right" onClick={openView}>
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
        <Route index element={<DepartmentTableView />} />
        <Route path="card-view" element={<DepartmentCardView />} />
        <Route path="chart-view" element={<DepartmentChartView />} />
      </Routes>
    </div>
  );
};

export default Departments;
