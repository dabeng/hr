import React, { useEffect } from "react";
import {
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  selectUser,
} from "../core/userSlice";
import {
  fetchEmployee,
  setEmployee,
  selectEmployee,
} from "../employees/employeeSlice";
import {
  selectEmployeeById,
} from "../employees/employeesSlice";

import { ProfileForm } from "./ProfileForm";

import styles from "./Profile.module.scss";


export const Profile = () => {
  const dispatch = useDispatch();

  const { id: userId } = useSelector(selectUser);
  const employeeId = new URLSearchParams(useLocation().search).get("employeeId");
  const existingEmployee = useSelector(state => selectEmployeeById(state, employeeId));
  const employees = useSelector(state => state.employees);
  const employee = useSelector(selectEmployee);

  // 跳转到“员工简介”页面的方式有很多种
  useEffect(() => {
    if (employees.ids.length && employeeId) { // 从employees页面跳转过来
      dispatch(setEmployee(existingEmployee));
    } else if (employeeId) { // 在浏览器地址栏中用查询参数直接访问某员工简介页面
      dispatch(fetchEmployee(employeeId));
    } else if (userId) {
      /*
       * 1 登陆成功后默认跳转到当前用户的简介页
       * 2 在accessToken有效期内，在浏览器地址栏中直接访问员工简介页面，渲染的是当前用户信息
       * 3 用户在导航栏中切换时，查看的是该用户的简介信息
      */
      dispatch(fetchEmployee(userId));
    }
  }, [dispatch, employees, employeeId, existingEmployee, userId]);

  return (
    <div className="columns">
      <div className="column is-4">
        <i className="fas fa-address-card fa-10x"></i>
      </div>
      <div className={"column is-8 " + styles.form_column}>
        {!existingEmployee && employee.status === "loading" && (
          <i className={"fas fa-circle-notch fa-spin fa-4x " + styles.spinner}></i>
        )}
        {!existingEmployee && employee.status === "succeeded" && (
          <ProfileForm employee={employee.value}/>
        )}
        {existingEmployee && (
          <ProfileForm employee={employee.value}/>
        )}
      </div>
    </div>
  );
};
