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
