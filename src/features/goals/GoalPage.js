import React from 'react'
import { useParams, Link } from 'react-router-dom'

import { useGetGoalQuery } from '../core/apiSlice';

const GoalPage = () => {
  const { goalId } = useParams();

  const { data: goal, isFetching, isSuccess } = useGetGoalQuery(goalId);

  return (
    <div>
      {isFetching && <i className={"fas fa-circle-notch fa-spin fa-4x "}></i>}
      {isSuccess &&
        <article className="goal">
          <h2>{goal.title}</h2>
          <p className="post-content">{goal.content}</p>
          <Link to={`/goals/edit/${goal.id}`} className="button">
            Edit Goal
          </Link>
        </article>
      }
    </div>
  );
}

export default GoalPage;