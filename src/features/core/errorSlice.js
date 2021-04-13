import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'error',
  initialState: {
    message: '',
  },
  reducers: {
    showError: (state, action) => {
      state.message = action.payload;
    },
    hideError: state => {
      state.message = "";
    },
  },
});

export const { showError, hideError } = slice.actions;

export const selectMessage = state => state.error.message;

export default slice.reducer;
