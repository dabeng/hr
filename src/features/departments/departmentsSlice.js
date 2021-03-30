import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import clientAPI from "../core/clientAPI";

const departmentsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return b.name.localeCompare(a.name);
  }
});

const initialState = departmentsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchDepartments = createAsyncThunk("departments/fetchDepartments", async ({page, pageSize, keyword}, thunkAPI) => {
  // let response = await fetch("http://localhost:3001/departments");
  // let departments = await response.json();
  // return departments;
  try {
    const params = new URLSearchParams({
      "_sort": "establish_date",
      "_order": "desc",
      "_page": page,
      "_limit": pageSize
    });
    if (keyword) {
      params.append("q", keyword);
    }
    const response = await clientAPI.fetchDepartments("/departments", params);
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


const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
  },
  extraReducers: {
    [fetchDepartments.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchDepartments.fulfilled]: (state, action) => {
      state.status = "succeeded";
      departmentsAdapter.upsertMany(state, action.payload);
    },
    [fetchDepartments.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export default departmentsSlice.reducer;

export const {
  selectAll: selectAllDepartments,
  selectById: selectDepartmentById,
  selectIds: selectDepartmentIds,
} = departmentsAdapter.getSelectors((state) => state.departments);

