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
      <input type="text"  {...register("title", {required: true, maxLength: 200})} />
      <textarea placeholder="content" {...register("content", {required: true, maxLength: 3000})} />

      <div class="field is-grouped">
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
