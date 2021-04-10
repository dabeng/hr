import React, { useState, useEffect } from "react";
import clientAPI from "../../core/clientAPI";

export const EmployeeChartView = () => {

  // const [state, setState] = useState([])
  useEffect(() => {

    const fetchEmployeeOrgChart = async () => {
      // setIsError(false);
      // setIsLoading(true);
 
      try {
        const params = new URLSearchParams({
          "employeeId": 16
        });
        const response = await clientAPI.fetchEmployeeOrgChart(params);
        console.log(response.data);
        // setData(result.data);
      } catch (error) {
        // setIsError(true);
      }
 
      // setIsLoading(false);
    };
 
    fetchEmployeeOrgChart();
  }, [])

  return (
    <div>
      <h2>Employee Chart View</h2>
    </div>
  );
};
