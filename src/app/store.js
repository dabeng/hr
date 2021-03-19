import { configureStore } from '@reduxjs/toolkit';

import userReducer from '../features/core/userSlice';
import employeeReducer from '../features/employees/employeeSlice';
import employeesReducer from '../features/employees/employeesSlice';
import departmentsReducer from '../features/departments/departmentsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    employee: employeeReducer,
    employees: employeesReducer,
    departments: departmentsReducer,
  },
});
