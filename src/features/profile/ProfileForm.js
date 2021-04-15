import React, {useState} from "react";
import { useForm } from 'react-hook-form';

export const ProfileForm = (props) => {
  const employee = props.employee;
  const [isEditViewOpen, setIsEditViewOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);

  const openEditView = e => {
    setIsEditViewOpen(true);
  };

  return (
    <>
     {!isEditViewOpen &&
      <>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <p className="has-text-dark">{employee.name}</p>
          </div>
        </div>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <p className="has-text-dark">{employee.title}</p>
          </div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <p className="has-text-dark">{employee.email}</p>
          </div>
        </div>
        <div className="field">
          <label className="label">Department</label>
          <div className="control">
            <p className="has-text-dark">{employee.department_name}</p>
          </div>
        </div>
        <div className="field">
          <label className="label">Reports to</label>
          <div className="control">
            <p className="has-text-dark">{employee.superior_name}</p>
          </div>
        </div>
        <div className="field">
          <label className="label">Reports</label>
          <div className="control">
            <p className="has-text-dark">
            {employee.inferior_names &&  employee.inferior_names.length &&
              employee.inferior_names.map((name, index, names) => (
                <span key={index}>{name + (index < names.length - 1 ? ",\u00A0\u00A0" : "")}</span>
              ))}
            </p>
          </div>
        </div>
        <div className="field">
          <label className="label">Joined Date</label>
          <div className="control">
            <p className="has-text-dark">{employee.joined_date}</p>
          </div>
        </div>
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <p className="has-text-dark">{employee.description}</p>
          </div>
        </div>
        {employee.role === "admin" &&
          <button className="button is-primary" onClick={openEditView}>Edit</button>
        }
      </>
      }
      {isEditViewOpen && <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="name" {...register("name", {required: true})} />
        <input type="text" placeholder="title" {...register("title", {required: true})} />
        <input type="email" placeholder="email" {...register("email", {required: true})} />
        <select {...register("department", { required: true })}>
          <option value="aa">aa</option>
          <option value="bb">bb</option>
        </select>
        <input type="text" placeholder="superior" {...register("superior", {required: true})} />
        <input type="text" placeholder="inferiors" {...register} />
        <input type="datetime" placeholder="joined_date" {...register("joined_date", {required: true})} />
        <textarea {...register} />
        <input className="button" type="submit" value="Submit"/>
        <input className="button" type="reset" value="Reset"/>
      </form>
      }
    </>
  );
};
