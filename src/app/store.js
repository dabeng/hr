import { configureStore } from '@reduxjs/toolkit';

import employeeReducer from '../features/employees/employeeSlice';
import employeesReducer from '../features/employees/employeesSlice';
import departmentsReducer from '../features/departments/departmentsSlice';

export default configureStore({
  reducer: {
    employee: employeeReducer,
    employees: employeesReducer,
    departments: departmentsReducer,
  },
});
