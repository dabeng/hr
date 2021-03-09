import { configureStore } from '@reduxjs/toolkit';

import employeesReducer from '../features/employees/employeesSlice';
import departmentsReducer from '../features/departments/departmentsSlice';

export default configureStore({
  reducer: {
    employees: employeesReducer,
    departments: departmentsReducer,
  },
});
