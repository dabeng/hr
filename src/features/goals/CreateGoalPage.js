import React, { useState } from "react";
import {
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { useForm } from 'react-hook-form';

import { useCreateGoalMutation } from '../core/apiSlice';

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
      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input className="input" type="text"  {...register("title", { required: true, maxLength: 200 })} />
        </div>
      </div>
      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <textarea className="textarea" placeholder="at least 100 words" {...register("content", { required: true, maxLength: 3000 })} />
        </div>
      </div>



      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <button type="submit" class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light">Reset</button>
        </div>
      </div>
    </form>
  );
};

export default CreateGoalPage;
