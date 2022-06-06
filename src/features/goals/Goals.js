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
        <>
          {goals.map(goal =>
            <article className={'box ' + styles.goal_excerpt} key={goal.id}>
              <div class="tags are-small">
                <span class="tag is-info">{goal.year}</span>
              </div>
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
          )}
                <nav
        className="pagination is-small"
        role="navigation"
        aria-label="pagination"
      >
        <a
          className="pagination-previous"
          onClick={() => setPage(page - 1)}
        >
          Previous
        </a>
        <a
          className="pagination-next"
          onClick={() => setPage(page + 1)}
        >
          Next
        </a>
      </nav>
          </>
        }
        {isError && error.toString()}
      </div>
    </div>
  );
};

export default Goals;
