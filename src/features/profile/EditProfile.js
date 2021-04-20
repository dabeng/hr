import React, { useEffect, unwrapResult } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { selectEmployee, updateEmployee, setEmployee, clearEmployeeState } from "../employees/employeeSlice";

export const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { value: employee, status} = useSelector(selectEmployee);

  // useEffect(() => { // TODO: 不知道为什么组件加载时，该值仍是succeeded
  //   if (status === 'succeeded') {
  //     history.push(`/profile/${employee.id}`);
  //   }
  // }, [status]);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm();

  const saveEdit = async (data) => {
    const updatedData = {};
    for (const key of Object.keys(dirtyFields)) {
      updatedData[key] = data[key];
    }
    
    await dispatch(updateEmployee({employeeId: employee.id, fields: updatedData}));
    history.push(`/profile/${employee.id}`);
  };

  return (
    <div className="columns">
      <div className="column is-4">
        <i className="fas fa-address-card fa-10x"></i>
      </div>
      <div className="column is-8">
        <form onSubmit={handleSubmit(saveEdit)}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input type="text" className="input" defaultValue={employee.name} placeholder="name" {...register("name", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input type="text" className="input" defaultValue={employee.title} placeholder="title" {...register("title", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input type="email" className="input" defaultValue={employee.email} placeholder="email" {...register("email", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Department</label>
            <div className="control">
              <div className="select">
                <select {...register}>
                  <option value="aa">aa</option>
                  <option value="bb">bb</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Superior</label>
            <div className="control">
              <input type="text" className="input" placeholder="superior" {...register}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Inferiors</label>
            <div className="control">
              <input type="text" className="input" placeholder="inferiors" {...register} />
            </div>
          </div>
          <div className="field">
            <label className="label">Joined Date</label>
            <div className="control">
              <input type="date" className="input" {...register("joined_date", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea className="textarea" defaultValue={employee.description} {...register("description")}/>
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <input type="reset" className="button" value="Reset"/>
            </div>
            <div className="control">
              <input type="submit" className="button is-link" value="Submit"/>
            </div>
            <div className="control">
              <button className="button is-link is-light">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
