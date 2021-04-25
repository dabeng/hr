import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import clientAPI from './clientAPI';

export const loginUser = createAsyncThunk('users/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await clientAPI.loginUser({email, password});
    if (response.status === 200) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data.user;
    } else {
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

// fetch user info when user bypasses login process and directly accesses any procted pages
export const fetchUserBytoken = createAsyncThunk('users/fetchUserByToken', async (thunkAPI) => {
  try {
    const response = await clientAPI.fetchUserByToken();
    if (response.status === 200) {
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
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
      // 注意这里只恢复Ajax请求相关的初始值
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