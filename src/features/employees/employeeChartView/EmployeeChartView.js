import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OrganizationChart from "@dabeng/react-orgchart";
import JSONDigger from "json-digger";

import { showError } from "./../../core/errorSlice";
import {
  selectEmployee,
} from "../employeeSlice";
import { selectUser } from "../../core/userSlice";
import clientAPI from "../../core/clientAPI";

import styles from "./EmployeeChartView.module.scss";

export const EmployeeChartView = () => {
  const dispatch = useDispatch();
  const { id: userId } = useSelector(selectUser);
  const activeEmployee = useSelector(selectEmployee);
  const activeEmployeeId = activeEmployee.value ? activeEmployee.value.id : userId;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ds, setDS] = useState({});
  useEffect(() => {
    const fetchEmployeeOrgChart = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const params = new URLSearchParams({
          "employeeId": activeEmployeeId
        });
        const response = await clientAPI.fetchEmployeeOrgChart(params);
        setDS(response.data);
      } catch (error) {
        setIsError(true);
        dispatch(showError('Failed to fetch orgchart data'));
      }
      setIsLoading(false);
    };
 
    fetchEmployeeOrgChart();
  }, []);

  return (
    <div>
      {isLoading && (
        <i className={"fas fa-circle-notch fa-spin fa-4x " + styles.spinner}></i>
      )}
      {!isLoading && !isError && (
        <OrganizationChart datasource={ds} />
      )}
    </div>
  );
};
