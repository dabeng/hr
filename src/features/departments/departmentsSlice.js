import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";

const departmentsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return b.name.localeCompare(a.name);
  }
});

const initialState = departmentsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchDepartments = createAsyncThunk("departments/fetchDepartments", async () => {
  let response = await fetch("http://localhost:3001/departments");
  let departments = await response.json();
  return departments;
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

