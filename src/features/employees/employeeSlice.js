import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

export const fetchEmployee = createAsyncThunk("employees/fetchEmployee", async (employeeId) => {
  let response = await fetch("http://localhost:3001/employees/" + employeeId);
  let employee = await response.json();
  return employee;
});

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {
    setEmployee: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: {
    [fetchEmployee.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchEmployee.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.value = action.payload;
    },
    [fetchEmployee.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { setEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;

export const selectEmployee = state => state.employee;
