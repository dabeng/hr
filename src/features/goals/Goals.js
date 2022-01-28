import React, { useMemo } from "react";
import { Routes, Route, Link } from "react-router-dom";
import classnames from "classnames";

import { useGetGoalsQuery, useDeleteGoalMutation } from "../core/apiSlice";

const Goals = () => {
  const {
    data: goals = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetGoalsQuery();

  const [deleteGoal, {
    isLoading2,
    isFetching2,
  }] = useDeleteGoalMutation();

  const sortedGoals = useMemo(() => {
    const sorted = goals.slice();
    // Sort posts in descending chronological order
    sorted.sort((a, b) => b.year - a.year);
    return sorted;
  }, [goals]);

  const removeGoal = async (goadId) => {
    try {
      await deleteGoal(goadId).unwrap();
    } catch (err) {
      console.error('Failed to save the post: ', err)
    }
  };

  return (
    <div>
      <Link to="/goals/create" className="button is-primary">
        Create Goal
      </Link>
      <div>
        {(isLoading || isFetching) && <i className={"fas fa-circle-notch fa-spin fa-4x "}></i>}
        {isSuccess && 
          sortedGoals.map(goal =>
            <article className="post-excerpt" key={goal.id}>
              <Link to={`/goals/${goal.id}`}>{goal.title}</Link>
              <p className="post-content">{goal.content.substring(0, 100)}</p>
              <button className="button is-danger" onClick={e => removeGoal(goal.id)}>
                Delete
              </button>
            </article>
          )
        }
        {isError && error.toString()}
      </div>
    </div>
  );
};

export default Goals;
