import React, { useMemo } from "react";
import { Routes, Route, Link } from "react-router-dom";
import classnames from "classnames";

import { useGetGoalsQuery, useDeleteGoalMutation } from "../core/apiSlice";

import styles from "./Goals.module.scss";

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
      <Link to="/goals/create" className="button is-primary mb-4">
        Create Goal
      </Link>
      <div className={styles.goal_list}>
        {(isLoading || isFetching) &&
          <div className="has-text-centered pt-6">
            <i className={"fas fa-circle-notch fa-spin fa-4x"}></i>
          </div>
        }
        {isSuccess && 
          sortedGoals.map(goal =>
            <article className={'box ' + styles.goal_excerpt} key={goal.id}>
              <h6 className="title is-6">
                <Link to={`/goals/${goal.id}`}>{goal.title}</Link>
              </h6>
              <p className={styles.post_content}>{goal.content}</p>
              <div className="buttons is-right pt-4">
                <button className="button is-danger is-small" onClick={e => removeGoal(goal.id)}>
                Delete
                </button>
              </div>
            </article>
          )
        }
        {isError && error.toString()}
      </div>
    </div>
  );
};

export default Goals;
