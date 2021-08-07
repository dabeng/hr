import React, {useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

import { showError } from "../core/errorSlice";
import clientAPI from "../core/clientAPI";
import { selectEmployee, updateEmployee } from "../employees/employeeSlice";
import useInfiniteScroll from "../core/useInfiniteScroll";

import "./EditProfile.scss";
import styles from "./EditProfile.module.scss";

export const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { value: employee} = useSelector(selectEmployee);
  // 所有部门的state
  const [departments, setDepartments] = useState([]);
  const PAGE_SIZE = 5;
  // 可选上级搜索框的相关state
  const [superiorKeywordInput, setSuperiorKeywordInput] = useState("");
  const [superiorKeyword, setSuperiorKeyword] = useState("");
  const [searchedSuperiors, setSearchedSuperiors] = useState(undefined);
  const [superiorName, setSuperiorName] = useState(employee.superior_name);
  const [isSuperiorFetching, setIsSuperiorFetching] = useState(false);
  const [spCurrentPage, setSpCurrentPage] = useState(0);
  const superiorContainer = useRef(null);
  // 可选下级搜索框的相关state
  const [inferiorKeywordInput, setInferiorKeywordInput] = useState("");
  const [inferiorKeyword, setInferiorKeyword] = useState("");
  const [searchedInferiors, setSearchedInferiors] = useState(undefined);
  const [inferiorNames, setInferiorNames] = useState(employee.inferior_names);
  const [isInferiorFetching, setIsInferiorFetching] = useState(false);
  const [ifCurrentPage, setIfCurrentPage] = useState(0);
  const inferiorContainer = useRef(null);
  
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
    reset,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      name: employee.name,
      title: employee.title,
      email: employee.email,
      department: employee.department,
      superior: employee.superior,
      inferiors: employee.inferiors,
      joined_date: employee.joined_date,
      description: employee.description
    }
  });

  // 获取备选部门的信息
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await clientAPI.fetchDepartments({});
        if (response.status === 200) {
          setDepartments(response.data);
          setValue('department', employee.department);
        } else {
          dispatch(showError("failed to fetch departments"));
        }
      } catch (err) {
        dispatch(showError("failed to fetch departments"));
      } finally {
        // setIsSuperiorFetching(false);
      }
    };
    fetchDepartments();
  }, []);

  // 跟踪上级搜索框的输入值
  const handleSKInputChange = e => {
    setSuperiorKeywordInput(e.target.value.trim());
  };

  // 跟踪下级搜索框的输入值
  const handleIKInputChange = e => {
    setInferiorKeywordInput(e.target.value.trim());
  };

  // 开始查询可选的上级数据，即第一页数据
  const triggerSearchSuperior = () => {
    superiorContainer.current.scrollTop = 0;
    setSpCurrentPage(1);
    setSuperiorKeyword(superiorKeywordInput);
    setIsSuperiorFetching(true);
  };

  // 开始查询下级数据，即第一页数据
  const triggerSearchInferior = () => {
    /* 下面这句设置非常重要。因为inferior-list里的滚动条的当前位置会影响到重新查询第一页数据时的滚动条位置。一旦
     * 当前的滚动条位置比较靠下，你又切换了一个关键字开始新搜索，那么很可能导致重新渲染首页数据时，滚动条起始位置就
     * 进入了底部20px的区域内，进而导致了自动的loadMore动作，这个动作冗余的，非预期的，所以这里我们通过提前设置
     * scrollTop=0来控制滚动条的起始位置，避免冗余的loadMore动作。
    */
    inferiorContainer.current.scrollTop = 0;
    setIfCurrentPage(1);
    setInferiorKeyword(inferiorKeywordInput);
    setIsInferiorFetching(true);
  };

  const handleSKInput = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (superiorKeywordInput.length) {
        triggerSearchSuperior();
      }
    }
  };

  const handleIKInput = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inferiorKeywordInput.length) {
        triggerSearchInferior();
      }
    }
  };

  const handleClickSpSearch = () => {
    if (superiorKeywordInput.length) {
      triggerSearchSuperior();
    }
  };

  const handleClickIfSearch = () => {
    if (inferiorKeywordInput.length) {
      triggerSearchInferior();
    }
  };

  const onSLScrollDown = () => {
    setSpCurrentPage(prevPage => prevPage + 1);
    setIsSuperiorFetching(true);
  };

  const onILScrollDown = () => {
    setIfCurrentPage(prevPage => prevPage + 1);
    setIsInferiorFetching(true);
  };

  useInfiniteScroll(superiorContainer, onSLScrollDown);

  useInfiniteScroll(inferiorContainer, onILScrollDown);

  useEffect(() => {
    const fetchSuperiors = async () => {
      try {
        // 搜索可成为上级的候选人（要排除自身，以及自身的所有下级）
        const response = await clientAPI.fetchEmployees({
          self: employee.id,
          candidate: 'superior',
          q: superiorKeyword,
          _page: spCurrentPage,
          _limit: PAGE_SIZE,
        });
        if (response.status === 200) {
          if (spCurrentPage === 1) {
            setSearchedSuperiors(response.data);
          } else {
            setSearchedSuperiors(prevSuperiors => [...prevSuperiors, ...response.data]);
          }
        } else {
          dispatch(showError("failed to search superiors"));
        }
      } catch (err) {
        dispatch(showError("failed to search superiors"));
      } finally {
        setIsSuperiorFetching(false);
      }
    };

    if (isSuperiorFetching && spCurrentPage && superiorKeyword) {
      fetchSuperiors();
    }
  }, [isSuperiorFetching, spCurrentPage, superiorKeyword]);

  useEffect(() => {
    const fetchInferiors = async () => {
      try {
        // 搜索可作为下级的候选人（要排除自身，以及自身的汇报上级）
        const response = await clientAPI.fetchEmployees({
          self: employee.id,
          candidate: 'inferior',
          q: inferiorKeyword,
          _page: ifCurrentPage,
          _limit: PAGE_SIZE,
        });
        if (response.status === 200) {
          if (ifCurrentPage === 1) {
            setSearchedInferiors(response.data);
          } else {
            setSearchedInferiors(prevInferiors => [...prevInferiors, ...response.data]);
          }
        } else {
          dispatch(showError("failed to search inferiors"));
        }
      } catch (err) {
        dispatch(showError("failed to search inferiors"));
      } finally {
        setIsInferiorFetching(false);
      }
    };

    if (isInferiorFetching && ifCurrentPage && inferiorKeyword) {
      fetchInferiors();
    }
  }, [isInferiorFetching, ifCurrentPage, inferiorKeyword]);

  // 指定当前employee的直接上级
  const bindSuperiorRelation = () => {
    // 在搜到的dropdown menu中，提取选中inferior item的索引值
    const radio = superiorContainer.current.querySelector(`input[name="searchedSuperiorList"]:checked`);
    if (radio) {
      // 更新inferior tag list的值
      setSuperiorName(searchedSuperiors[radio.value].name);
      // 更新react-hook-form中注册的inferior字段
      setValue('superior', searchedSuperiors[radio.value].id, { shouldDirty: true });
    }
    // 清理一切和关键字搜索有关的state
    setSuperiorKeywordInput('');
    setSuperiorKeyword('');
    setSearchedSuperiors(undefined);
    setSpCurrentPage(0);
  };

  // 指定当前employee的直接下级
  const bindInferiorRelation = () => {
    // 在搜到的dropdown menu中，提取选中inferior item的索引值
    const checkboxes = inferiorContainer.current.querySelectorAll(`input[name="searchedInferiorList"]:checked`);
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
    // 清理一切和关键字搜索有关的state
    setInferiorKeywordInput('');
    setInferiorKeyword('');
    setSearchedInferiors(undefined);
    setIfCurrentPage(0);
  };

  /* 从当前employee的直接上级中，去掉由索引指定的上级
   * TODO: 理想状态中，应该像上面描述但那样，允许指定多个上级，但目前orgchart组件只支持单个父节点的
   * 所以以下代码暂停启用。
  const unbindSuperiorRelation = (index) => {
    setSuperiorNames(prev => {
      const temp0 = [...prev];
      temp0.splice(index, 1)
      return temp0;
    });
    const temp = getValues("superiors").split(',');
    temp.splice(index, 1);
    setValue('superiors', temp.join(','), { shouldDirty: true });
  };*/

  // 从当前employee的直接下级中，去掉由索引指定的下级
  const unbindInferiorRelation = (index) => {
    setInferiorNames(prev => {
      const temp0 = [...prev];
      temp0.splice(index, 1)
      return temp0;
    });
    let temp = [...getValues("inferiors")];
    temp.splice(index, 1);
    setValue('inferiors', temp, { shouldDirty: true });
  };

  // 表单里的大部分字段是依据浏览器的默认行为恢复到初始值的。下面函数负责恢复复杂字段的初值
  const resetEdit = (e) => {
    e.preventDefault();
    // 恢复表单里所有字段的初值
    reset();
    // 处理superior
    setSuperiorName(employee.superior_name);
    setSuperiorKeywordInput('');
    // 处理inferiors
    setInferiorNames(employee.inferior_names);
    setInferiorKeywordInput('');
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

  const cancelEdit = e => {
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
              <input type="text" name="field_name" className="input" placeholder="name" {...register("name", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input type="text" name="field_title" className="input" placeholder="title" {...register("title", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input type="email" name="field_email" className="input" placeholder="email" {...register("email", { required: true })}/>
            </div>
          </div>
          <div className="field">
            <label className="label">Department</label>
            <div className="control">
              <div className={"select is-fullwidth" + (departments.length === 0 ? " is-loading" : "")}>
                <select {...register("department")}>
                  {departments.length > 0 && departments.map(depart =>
                    <option key={depart.id} value={depart.id}>{depart.name}</option>
                  )}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Superior</label>
            <div className="control">
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input type="hidden" {...register("superior")}/>
                  <div className={"dropdown" + (superiorKeyword ? " is-active" : "")} style={{"display": "block"}}>
                    <div className="dropdown-trigger">
                      <input type="text" className="input" placeholder="superior" value={superiorKeywordInput} onChange={handleSKInputChange} onKeyPress={handleSKInput}/>
                    </div>
                    <div className="dropdown-menu" role="menu">
                      <div className="dropdown-content">
                        <div className={styles.dropdown_mask + " is-overlay " + (isSuperiorFetching ? "" : "is-hidden")}>
                          <i className="fas fa-circle-notch fa-spin fa-2x spinner"></i>
                        </div>
                        <div className={styles.dropdown_list + (isSuperiorFetching ? " " + styles.is_fetching : "")} ref={superiorContainer}>
                          {searchedSuperiors && searchedSuperiors.length === 0 &&
                            <div className="dropdown-item">
                              <p className="has-text-danger">No results found</p>
                            </div>
                          }
                          {searchedSuperiors && searchedSuperiors.length > 0 && searchedSuperiors.map((superior, index) => (
                            <a key={superior.id} className="dropdown-item" style={{"whiteSpace": "nowrap"}}>
                              <label className="checkbox">
                                <input type="radio" name="searchedSuperiorList" value={index}/>&nbsp;
                                <span>{superior.name}</span> | <span>{superior.email}</span>
                              </label>
                            </a>
                          ))}
                        </div>
                        {searchedSuperiors && searchedSuperiors.length > 0 &&
                          <>
                            <hr className="dropdown-divider"/>
                            <button type="button" className="button is-primary is-small is-fullwidth" onClick={bindSuperiorRelation}>Done</button>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="control">
                  <button type="button" className="button is-primary" onClick={handleClickSpSearch}>Search</button>
                </div>
              </div>
              <span className="tag is-info is-light" style={{margin: "0.5rem 0.5rem 0 0"}}>
                {superiorName}
                {/* TODO: 目前orgchart组件还未开放选多个直接上级的功能，所以下面注释掉删除备选者的按钮 */}
                {/* <button type="button" className="delete" onClick={() => unbindSuperiorRelation(index)}></button> */}
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Inferiors</label>
            <div className="control">
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input type="hidden" {...register("inferiors")}/>
                  {/* inferiorKeyword非空时，意味着开始查询下级，弹出下拉菜单 */}
                  <div className={"dropdown" + (inferiorKeyword ? " is-active" : "")} style={{"display": "block"}}>
                    <div className="dropdown-trigger">
                      <input type="text" className="input" placeholder="inferiors" value={inferiorKeywordInput} onChange={handleIKInputChange} onKeyPress={handleIKInput}/>
                    </div>
                    <div className="dropdown-menu" role="menu">
                      <div className="dropdown-content">
                        <div className={styles.dropdown_mask + " is-overlay " + (isInferiorFetching ? "" : "is-hidden")}>
                          <i className="fas fa-circle-notch fa-spin fa-2x spinner"></i>
                        </div>
                        <div className={styles.dropdown_list + (isInferiorFetching ? " " + styles.is_fetching : "")} ref={inferiorContainer}>
                          {searchedInferiors && searchedInferiors.length === 0 &&
                            <div className="dropdown-item">
                              <p className="has-text-danger">No results found</p>
                            </div>
                          }
                          {searchedInferiors && searchedInferiors.length > 0 && searchedInferiors.map((inferior, index) => (
                            <a key={inferior.id} className="dropdown-item" style={{"whiteSpace": "nowrap"}}>
                              <label className="checkbox">
                                <input type="checkbox" name="searchedInferiorList" value={index}/>&nbsp;
                                <span>{inferior.name}</span> | <span>{inferior.email}</span>
                              </label>
                            </a>
                          ))}
                        </div>
                        {searchedInferiors && searchedInferiors.length > 0 &&
                          <>
                            <hr className="dropdown-divider"/>
                            <button type="button" className="button is-primary is-small is-fullwidth" onClick={bindInferiorRelation}>Done</button>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="control">
                  <button type="button" className="button is-primary" onClick={handleClickIfSearch}>Search</button>
                </div>
              </div>
              {inferiorNames.map((inferiorName, index) => (
                <span key={index} className="tag is-info is-light" style={{margin: "0.5rem 0.5rem 0 0"}}>
                  {inferiorName}
                  <button type="button" className="delete" onClick={() => unbindInferiorRelation(index)}></button>
                </span>
              ))}
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
              <textarea className="textarea" {...register("description")}/>
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <input type="reset" className="button" value="Reset" onClick={resetEdit}/>
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
