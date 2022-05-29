import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { useGetGoalQuery, useUpdateGoalMutation } from './GoalsSlice';

const EditGoalPage = () => {

  const navigate = useNavigate();
  const { goalId } = useParams();
  const { data: goal } = useGetGoalQuery(goalId)
  const [ updateGoal, { isLoading }  ] = useUpdateGoalMutation(goalId);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      title: goal.title,
      content: goal.content
    }
  });

  const saveGoal = async (data) => {
    if (Object.keys(dirtyFields).length === 0) {
      return;
    }
    const updatedData = {};
    for (const key of Object.keys(dirtyFields)) {
      updatedData[key] = data[key];
    }
    
    await updateGoal({ id: goalId, ...updatedData });
    navigate('/goals');
  };

  const resetForm = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(saveGoal)}>
      {isLoading && <i className={"fas fa-circle-notch fa-spin fa-4x"}></i>}

      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input className="input" type="text"  {...register("title", { required: true, maxLength: 200 })} />
        </div>
      </div>
      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <textarea className="textarea" placeholder="at least 100 words" {...register("content", { required: true, maxLength: 3000 })} />
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">Save</button>
        </div>
        <div className="control">
          <button type="button" className="button is-link is-light" onClick={resetForm}>Reset</button>
        </div>
      </div>
    </form>
  );
};

export default EditGoalPage;
