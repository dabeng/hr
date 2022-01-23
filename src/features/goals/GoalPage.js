import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { useGetGoalsQuery } from '../core/apiSlice';

const GoalPage = () => {

  const {
    data: goals,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetGoalsQuery();

  return (
    <div>
      Single Goal Page
    </div>
  );
};

export default GoalPage;
