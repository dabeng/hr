import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const employeesAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return b.joined_date.localeCompare(a.joined_date);
  }
});

const initialState = employeesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchEmployees = createAsyncThunk("employees/fetchEmployees", async (page) => {
  let response = await fetch("http://localhost:3001/employees?_page=" + page);
  let employees = await response.json();
  // let total = response.headers.get('X-Total-Count');
  return employees;
});


const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
  },
  extraReducers: {
    [fetchEmployees.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchEmployees.fulfilled]: (state, action) => {
      state.status = "succeeded";
      employeesAdapter.setAll(state, action.payload);
    },
    [fetchEmployees.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export default employeesSlice.reducer;

export const {
  selectAll: selectAllEmployees,
  selectById: selectEmployeeById,
  selectIds: selectEmployeeIds,
} = employeesAdapter.getSelectors((state) => state.employees);

