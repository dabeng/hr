import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
// import { DepartmentTableView } from "./DepartmentTableView/DepartmentTableView";
// import { DepartmentCardView } from "./DepartmentCardView/DepartmentCardView";
// import { DepartmentChartView } from "./DepartmentChartView/DepartmentChartView";
import { useGetGoalsQuery } from '../core/apiSlice';

const Goals = () => {

  const {
    data: goals,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetGoalsQuery();

  return (
    <div>
      {isLoading && <i className={"fas fa-circle-notch fa-spin fa-4x "}></i>}
      {isSuccess && goals.map(goal => <h1 className="title is-2" key={goal.id}>{goal.title}</h1>)}
      {isError && error.toString()}


      {/* <Routes>
        <Route index element={<DepartmentTableView />} />
        <Route path="card-view" element={<DepartmentCardView />} />
        <Route path="chart-view" element={<DepartmentChartView />} />
      </Routes> */}
    </div>
  );
};

export default Goals;
