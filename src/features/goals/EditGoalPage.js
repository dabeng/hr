import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { useGetGoalsQuery } from '../core/apiSlice';

const EditGoalPage = () => {

  const {
    data: goals,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetGoalsQuery();

  return (
    <div>
      Update Goal Page
    </div>
  );
};

export default EditGoalPage;
