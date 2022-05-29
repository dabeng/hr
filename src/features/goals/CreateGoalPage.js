import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { useForm } from 'react-hook-form';

import { useCreateGoalMutation } from './GoalsSlice';

const CreateGoalPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [createGoal, { isLoading }] = useCreateGoalMutation();

  const onSubmit = async (data) => {
    try {
      await createGoal(data).unwrap();
      reset();
    } catch (err) {
      console.error('Failed to save the post: ', err)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <div className="field is-grouped is-grouped-right">
        <div className="control">
          <button type="submit" className="button is-link">Submit</button>
        </div>
        <div className="control">
          <button type="reset" className="button is-link is-light">Reset</button>
        </div>
      </div>
    </form>
  );
};

export default CreateGoalPage;
