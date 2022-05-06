import React from 'react'
import { useParams, Link } from 'react-router-dom';

import { useGetGoalQuery } from '../core/apiSlice';

const GoalPage = () => {
  const { goalId } = useParams();

  const { data: goal, isFetching, isSuccess } = useGetGoalQuery(goalId);

  return (
    <div>
      {isFetching && <i className={"fas fa-circle-notch fa-spin fa-4x "}></i>}
      {isSuccess &&
        <article className="goal">
          <h4 className="title is-4 px-4">{goal.title}</h4>
          <p className="post-content px-4">{goal.content}</p>
          <Link to={`/goals/edit/${goal.id}`} className="button is-pulled-right mr-4">
            Edit Goal
          </Link>
        </article>
      }
    </div>
  );
}

export default GoalPage;