import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk('users/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await fetch(
      'http://localhost:3001/login',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      }
    );
    let data = await response.json();
    console.log('response', data);
    if (response.status === 200) {
      localStorage.setItem('accessToken', data.token);
      return data.user;
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (e) {
    console.log('Error', e.response.data);
    thunkAPI.rejectWithValue(e.response.data);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    role: '',
    name: '',
    email: '',
    status: 'idle',
    error: null,
  },
  reducers: {

  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.status = "succeeded";
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }
  },
});

export const { clearState } = userSlice.actions;

export const selectUser = state => state.user;

export default userSlice.reducer;