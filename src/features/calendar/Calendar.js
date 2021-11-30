import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import YearView from "./YearView";
import MonthView from "./MonthView";

const Calendar = () => {
  const location = useLocation();
  const [activeView, setActiveView] = useState(location.pathname === '/calendar' ? 'month-view' : location.pathname.split('/').slice(-1)[0]);

  function openView(e) {
    if (e.target.nodeName === 'A') {
      setActiveView(e.target.href.split('/').slice(-1)[0] === 'calendar' ?
        'month-view' : e.target.href.split('/').slice(-1)[0]);
    }
  };

  return (
    <div>
      <div className="tabs is-right" onClick={openView}>
        <ul>
          <li className={`${activeView === 'month-view' ? 'is-active': ''}`}>
            <Link to="">month view</Link>
          </li>
          <li className={`${activeView === 'year-view' ? 'is-active': ''}`}>
            <Link to="year-view">year view</Link>
          </li>
        </ul>
      </div>

      <Routes>
        <Route index element={<MonthView />} />
        <Route path="year-view" element={<YearView />} />
      </Routes>
    </div>
  );
};

export default Calendar;
