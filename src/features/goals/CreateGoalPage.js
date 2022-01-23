import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { useGetGoalsQuery } from '../core/apiSlice';

const CreateGoalPage = () => {

  const {
    data: goals,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetGoalsQuery();

  return (
    <div>
      Create Goal Page
    </div>
  );
};

export default CreateGoalPage;
