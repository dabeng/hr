import React, { useMemo } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

import { useGetGoalsQuery } from '../core/apiSlice';

const Goals = () => {

  const {
    data: goals = [],
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetGoalsQuery();

  const sortedGoals = useMemo(() => {
    const sorted = goals.slice();
    // Sort posts in descending chronological order
    sorted.sort((a, b) => b.year - a.year);
    return sorted;
  }, [goals]);

  return (
    <div>
      {isLoading && <i className={"fas fa-circle-notch fa-spin fa-4x "}></i>}
      {isSuccess && sortedGoals.map(goal =>
        <article className="post-excerpt" key={goal.id}>
          <Link to={`/goals/${goal.id}`}>{goal.title}</Link>
          <p className="post-content">{goal.content.substring(0, 100)}</p>
        </article>  
      )}
      {isError && error.toString()}
    </div>
  );
};

export default Goals;
