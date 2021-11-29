import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import YearView from "./YearView";
import MonthView from "./MonthView";

const Calendar = () => {
  const [activeView, setActiveView] = useState('month-view');

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
        <Route path="month-view" element={<MonthView />} />
        <Route path="year-view" element={<YearView />} />
      </Routes>
    </div>
  );
};

export default Calendar;
