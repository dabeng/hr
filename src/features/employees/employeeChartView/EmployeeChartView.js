import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import OrganizationChart from "@dabeng/react-orgchart";
import JSONDigger from "json-digger";

import {
  selectEmployee,
} from "../employeeSlice";
import { selectUser } from "../../core/userSlice";
import clientAPI from "../../core/clientAPI";

export const EmployeeChartView = () => {

  const { id: userId } = useSelector(selectUser);
  const activeEmployee = useSelector(selectEmployee);
  const activeEmployeeId = activeEmployee.value ? activeEmployee.value.id : userId;

  const [ds, setDS] = useState({});
  useEffect(() => {

    const fetchEmployeeOrgChart = async () => {
      // setIsError(false);
      // setIsLoading(true);
 
      try {
        const params = new URLSearchParams({
          "employeeId": activeEmployeeId
        });
        const response = await clientAPI.fetchEmployeeOrgChart(params);
        console.log(response.data);
        setDS(response.data);
      } catch (error) {
        // setIsError(true);
      }
 
      // setIsLoading(false);
    };
 
    fetchEmployeeOrgChart();
  }, [])

  return (
    <div>
      <OrganizationChart datasource={ds} />
    </div>
  );
};
