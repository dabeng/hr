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
  } catch (err) {
    thunkAPI.rejectWithValue(err);
  }
});

// fetch user info when user bypasses login process and directly accesses any procted pages
export const fetchUserBytoken = createAsyncThunk('users/fetchUserByToken', async (token, thunkAPI) => {
  try {
    const response = await fetch('http://localhost:3001/user', {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      return { ...data };
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});
// 权限验证相关的state可以放在一个slice中，包括注册，登陆，用token取用户信息等等
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
    clearUserState: (state) => {
      state.status = "idle";
      state.error = null;
    },
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
    },
    [fetchUserBytoken.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchUserBytoken.fulfilled]: (state, action) => {
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.status = "succeeded";
    },
    [fetchUserBytoken.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    }
  },
});

export const { clearUserState } = userSlice.actions;

export const selectUser = state => state.user;

export default userSlice.reducer;