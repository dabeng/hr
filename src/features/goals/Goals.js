import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
// import { DepartmentTableView } from "./DepartmentTableView/DepartmentTableView";
// import { DepartmentCardView } from "./DepartmentCardView/DepartmentCardView";
// import { DepartmentChartView } from "./DepartmentChartView/DepartmentChartView";

const Goals = () => {


  return (
    <div>
      <div className="columns">
        <div className="column">
         Goals
        </div>
        <div className="column"></div>
      </div>


      {/* <Routes>
        <Route index element={<DepartmentTableView />} />
        <Route path="card-view" element={<DepartmentCardView />} />
        <Route path="chart-view" element={<DepartmentChartView />} />
      </Routes> */}
    </div>
  );
};

export default Goals;
