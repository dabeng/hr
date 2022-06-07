import React, { useMemo, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import classnames from "classnames";

import { useGetGoalsQuery, useDeleteGoalMutation } from "./GoalsSlice";

import styles from "./Goals.module.scss";

const Goals = () => {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const {
    data: goals = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetGoalsQuery(page, pageSize);

  const [deleteGoal, { isLoading2, isFetching2 }] = useDeleteGoalMutation();

  // const sortedGoals = useMemo(() => {
  //   const sorted = goals.slice();
  //   // Sort posts in descending chronological order
  //   sorted.sort((a, b) => b.year - a.year);
  //   return sorted;
  // }, [goals]);

  const removeGoal = async (goadId) => {
    try {
      await deleteGoal(goadId).unwrap();
    } catch (err) {
      console.error("Failed to save the post: ", err);
    }
  };

  const isPrevBtnDisabled = page === 1;
  const isNextBtnDisabled = page === goals.totalPages;

  const previousPage = () => {
    setPage((prev) => prev - 1);
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <Link to="/goals/create" className="button is-primary mb-4">
        Create Goal
      </Link>
      <div className={styles.goal_list}>
        {isFetching && (
          <div className="has-text-centered pt-6">
            <i className={"fas fa-circle-notch fa-spin fa-4x"}></i>
          </div>
        )}
        {isSuccess &&
          goals.data.map((goal) => (
            <article className={"box " + styles.goal_excerpt} key={goal.id}>
              <div className="tags are-small">
                <span className="tag is-info">{goal.year}</span>
              </div>
              <h6 className="title is-6">
                <Link to={`/goals/${goal.id}`}>{goal.title}</Link>
              </h6>
              <p className={styles.post_content}>{goal.content}</p>
              <div className="buttons is-right pt-4">
                <button
                  className="button is-danger is-small"
                  onClick={(e) => removeGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        {isError && error.toString()}
      </div>
      {isSuccess && (
        <nav
          className="pagination is-small"
          role="navigation"
          aria-label="pagination"
        >
          <a
            className={
              "pagination-previous button" + (isFetching ? " is-loading" : "")
            }
            onClick={!isPrevBtnDisabled ? previousPage : undefined}
            disabled={isPrevBtnDisabled}
          >
            Previous
          </a>
          <a
            className={
              "pagination-next button" + (isFetching ? " is-loading" : "")
            }
            onClick={!isNextBtnDisabled ? nextPage : undefined}
            disabled={isNextBtnDisabled}
          >
            Next
          </a>
        </nav>
      )}
    </>
  );
};

export default Goals;
