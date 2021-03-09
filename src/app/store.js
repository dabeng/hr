import { configureStore } from '@reduxjs/toolkit';

import employeesReducer from '../features/employees/employeesSlice';

export default configureStore({
  reducer: {
    employees: employeesReducer,
  },
});
