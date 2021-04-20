import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import clientAPI from "../core/clientAPI";

export const fetchEmployee = createAsyncThunk("employees/fetchEmployee", async (employeeId, thunkAPI) => {
  try {
    const response = await clientAPI.fetchEmployee(employeeId);
    if (response.status === 200) {
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (err) {
    thunkAPI.rejectWithValue(err.response.data);
  }
});

export const updateEmployee = createAsyncThunk("employees/updateEmployee", async (data, thunkAPI) => {
  try {
    const response = await clientAPI.updateEmployee(data.employeeId, data.fields);
    if (response.status === 200) {
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (err) {
    thunkAPI.rejectWithValue(err.response.data);
  }
});

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {
    clearEmployeeState: (state) => {
      state.status = "idle";
      state.error = null;
    },
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
    [updateEmployee.pending]: (state, action) => {
      state.status = "loading";
    },
    [updateEmployee.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.value = action.payload;
    },
    [updateEmployee.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { setEmployee, clearEmployeeState } = employeeSlice.actions;

export default employeeSlice.reducer;

export const selectEmployee = state => state.employee;
