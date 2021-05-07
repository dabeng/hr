import React, { useEffect, unwrapResult, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { showError } from "../core/errorSlice";
import clientAPI from "../core/clientAPI";
import { selectEmployee, updateEmployee, setEmployee, clearEmployeeState } from "../employees/employeeSlice";

export const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { value: employee, status} = useSelector(selectEmployee);
  const [inferiorKeyword, setInferiorKeyword] = useState("");
  const inferiorDropdown = useRef(null);
  const [isLoadingInferiors, setIsLoadingInferiors] = useState(false);
  const [searchedInferiors, setSearchedInferiors] = useState(undefined);
  const [inferiorNames, setInferiorNames] = useState(employee.inferior_names);

  // useEffect(() => { // TODO: 不知道为什么组件加载时，该值仍是succeeded
  //   if (status === 'succeeded') {
  //     history.push(`/profile/${employee.id}`);
  //   }
  // }, [status]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm();

  const updateInferiorKeyword = e => {
    setInferiorKeyword(e.target.value.trim());
  };

  // const searchInferior = e => {
  //   dispatch(fetchEmployees({page: 1, pageSize: PAGE_SIZE, keyword}));
  // };

  const triggerSearchInferior = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inferiorKeyword.length) {
        setIsLoadingInferiors(true);
        searchInferior();
      }
    }
  };

  const searchInferior = async () => {
    try {
      const response = await clientAPI.fetchEmployees({q: inferiorKeyword});
      
        setSearchedInferiors(response.data);
      
    } catch (err) {
      showError('Failed to fetch inferior info'); // for users
      console.log('Error: ' + err.response.data); // for developers
    } finally {
      setIsLoadingInferiors(false);
    }
  };

  const cancelEdit = e => {
    history.push(`/profile/${employee.id}`);
  };

  const bindRelation = () => {
    // 在搜到的dropdown menu中，提取选中inferior item的索引值
    const checkboxes = inferiorDropdown.current.querySelectorAll(`input[name="searchedInferiorList"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });

    // 向inferior tag list追加新的值
    setInferiorNames(prev => {
      const temp0 = [...prev];
      values.forEach(index => {
        temp0.push(searchedInferiors[index].name);
      });
      
      return temp0;
    });
    // 向react-hook-form中注册的inferior字段中追加新的inferior的id
    const temp = getValues("inferiors").split(',');
    values.forEach(index => {
      temp.push(searchedInferiors[index].id);
    });
    setValue('inferiors', temp.join(','), { shouldDirty: true });
    // 
    setSearchedInferiors(undefined);
  };

  const unbindRelation = (index) => {
    setInferiorNames(prev => {
      const temp0 = [...prev];
      temp0.splice(index, 1)
      return temp0;
    });
    const temp = getValues("inferiors").split(',');
    temp.splice(index, 1);
    setValue('inferiors', temp.join(','), { shouldDirty: true });
  };

  const saveEdit = async (data, e) => {
    // if (e.target.type !== 'submit') return;
    const updatedData = {};
    for (const key of Object.keys(dirtyFields)) {
      if (key === 'inferiors') {
        updatedData[key] = data[key] ? data[key].split(',').map(item => parseInt(item)) : [];
      } else {
        updatedData[key] = data[key];
      }
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
              <input type="text" name="field_name" className="input" defaultValue={employee.name} placeholder="name" {...register("name", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input type="text" name="field_title" className="input" defaultValue={employee.title} placeholder="title" {...register("title", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input type="email" name="field_email" className="input" defaultValue={employee.email} placeholder="email" {...register("email", { required: true })}/>
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
              <input type="text" name="field_superior" className="input" placeholder="superior" {...register}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Inferiors</label>
            <div className={"control" + (isLoadingInferiors ? " is-loading" : "")}>
              <input type="hidden" defaultValue={employee.inferiors} {...register("inferiors")}/>
              <div ref={inferiorDropdown} className={"dropdown" + (searchedInferiors !== undefined ? " is-active" : "")} style={{"display": "block"}}>
                <div className="dropdown-trigger">
                  <input type="text" className="input" placeholder="inferiors" value={inferiorKeyword} onChange={updateInferiorKeyword} onKeyPress={triggerSearchInferior}/>
                </div>
                {searchedInferiors !== undefined &&
                  <div className="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      {searchedInferiors.length === 0 &&
                        <div class="dropdown-item">
                          <p className="has-text-danger">No results found</p>
                        </div>
                      }
                      {searchedInferiors.length > 0 &&
                        <>
                          {searchedInferiors.map((inferior, index) => (
                            <a key={inferior.id} className="dropdown-item" style={{"whiteSpace": "nowrap"}}>
                              <label className="checkbox">
                                <input type="checkbox" name="searchedInferiorList" value={index}/>&nbsp;
                                <span>{inferior.name}</span> | <span>{inferior.email}</span>
                              </label>
                            </a>
                          ))}
                          <hr className="dropdown-divider"/>
                          <button type="button" className="button is-primary is-small is-fullwidth" onClick={bindRelation}>Done</button>
                        </>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
            {inferiorNames.map((inferiorName, index) => (
              <span key={index} className="tag is-info is-light" style={{margin: "0.5rem 0.5rem 0 0"}}>
                {inferiorName}
                <button type="button" className="delete" onClick={() => unbindRelation(index)}></button>
              </span>
            ))}
          </div>
          <div className="field">
            <label className="label">Joined Date</label>
            <div className="control">
              <input type="date" className="input" defaultValue={employee.joined_date} {...register("joined_date", { required: true })}/>
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
              <input type="submit" name="btn_submit" className="button is-link" value="Submit"/>
            </div>
            <div className="control">
              <button className="button is-link is-light" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
