import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import clientAPI from "../core/clientAPI";

const employeesAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    // descending order according to joined date
    return b.joined_date.localeCompare(a.joined_date);
  }
});

const initialState = employeesAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchEmployees = createAsyncThunk("employees/fetchEmployees", async ({page, pageSize, keyword}, thunkAPI) => {
  try {
    const params = new URLSearchParams({
      "_sort": "joined_date",
      "_order": "desc",
      "_page": page,
      "_limit": pageSize
    });
    if (keyword) {
      params.append("q", keyword);
    }
    const response = await clientAPI.fetchEmployees("http://localhost:3001/employees", params, localStorage.getItem('accessToken'));
    if (response.status === 200) {
      response.data.total = parseInt(response.headers['x-total-count']);
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (err) {
    thunkAPI.rejectWithValue(err.response.data);
  }
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
      state.total = action.payload.total;
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

