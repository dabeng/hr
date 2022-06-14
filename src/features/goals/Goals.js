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

  const pageSpan = 3;
  const isPrevBtnDisabled = page === 1;
  const isNextBtnDisabled = page === goals.totalPages;

  const previousPage = () => {
    setPage((prev) => prev - 1);
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const gotoPage = (e) => {
    setPage(parseInt(e.target.textContent));
  };

  return (
    <>
      <Link to="/goals/create" className="button is-primary mb-4">
        Create Goal
      </Link>
      <div className={styles.goal_list}>
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
        {isFetching && (
          <div className={styles.loading_spinner_wrapper}>
            <span className={"icon " + styles.loading_spinner}>
              <i className="fas fa-circle-notch fa-spin fa-4x"></i>
            </span>
          </div>
        )}
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
          {goals.totalPages > 0 && (
            <ul className="pagination-list">
              {goals.totalPages === 1 && (
                <li>
                  <a className="pagination-link" aria-label="Goto page 1">
                    1
                  </a>
                </li>
              )}
              {goals.totalPages - pageSpan <= 2 &&
                Array(goals.totalPages)
                  .fill(0)
                  .map((v, index) => (
                    <li key={index}>
                      <a
                        className={
                          "pagination-link" +
                          (index + 1 === page ? " is-current" : "")
                        }
                        aria-label={"Goto page " + (index + 1)}
                        aria-current={index + 1 === page ? "page" : undefined}
                        onClick={gotoPage}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}
              {goals.totalPages - pageSpan > 2 && (
                <>
                  <li>
                    <a
                      className="pagination-link"
                      aria-label="Goto page 1"
                      onClick={gotoPage}
                    >
                      1
                    </a>
                  </li>
                  {page - Math.ceil(pageSpan / 2) > 1 && (
                    <li>
                      <span className="pagination-ellipsis">&hellip;</span>
                    </li>
                  )}
                  {page - Math.ceil(pageSpan / 2) <= 1 &&
                    Array(page + Math.ceil(pageSpan / 2))
                      .fill(0)
                      .map((v, index) => (
                        <li key={index}>
                          <a
                            className={
                              "pagination-link" +
                              (index + 2 === page ? " is-current" : "")
                            }
                            aria-label={"Goto page " + (index + 2)}
                            aria-current={
                              index + 2 === page ? "page" : undefined
                            }
                            onClick={gotoPage}
                          >
                            {index + 2}
                          </a>
                        </li>
                      ))}
                  {page - Math.ceil(pageSpan / 2) > 1 && (
                    <>
                      <li>
                        <a
                          className="pagination-link"
                          aria-label={"Goto page " + (page - 1)}
                          onClick={gotoPage}
                        >
                          {page - 1}
                        </a>
                      </li>
                      <li>
                        <a
                          className="pagination-link"
                          aria-label={"Goto page " + page}
                          onClick={gotoPage}
                        >
                          {page}
                        </a>
                      </li>
                      <li>
                        <a
                          className="pagination-link"
                          aria-label={"Goto page " + (page + 1)}
                          onClick={gotoPage}
                        >
                          {page + 1}
                        </a>
                      </li>
                    </>
                  )}
                  {page + 2 < goals.totalPages && (
                    <li>
                      <span className="pagination-ellipsis">&hellip;</span>
                    </li>
                  )}
                  <li>
                    <a
                      className="pagination-link"
                      aria-label={"Goto page " + goals.totalPages}
                      onClick={gotoPage}
                    >
                      {goals.totalPages}
                    </a>
                  </li>
                </>
              )}
            </ul>
          )}
        </nav>
      )}
    </>
  );
};

export default Goals;
