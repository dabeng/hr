import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import clientAPI from './clientAPI';

/* NOTE: Do not introduce side effects into createAsyncThunk() and createSlice()
 * That means there shouldn't be localStorage or console.log in this file
 */
export const loginUser = createAsyncThunk('users/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await clientAPI.loginUser({email, password});
    if (response.status === 200) {
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const logoutUser = createAsyncThunk('users/logout', async (refreshToken, thunkAPI) => {
  try {
    const response = await clientAPI.logoutUser(refreshToken);
    if (response.status === 200) {
      return response.data;
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
/* 权限验证相关的state可以放在一个slice中，包括注册，登陆，用token取用户信息等等 */
// 从localStorage中读出登陆用户信息，reload page时就派上用场了
const initialUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: initialUser?.user?.id,
    role: initialUser?.user?.role,
    name: initialUser?.user?.name,
    email: initialUser?.user?.email,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearUserState: (state) => {
      // 这里只把登陆时使用过的临时状态恢复初值
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.id = action.payload.user.id;
      state.role = action.payload.user.role;
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
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
    },
    [logoutUser.fulfilled]: (state, {payload}) => {
      state.name = '';
      state.email = '';
    },
    [logoutUser.rejected]: (state, {payload}) => {
      state.name = '';
      state.email = '';
    }
  },
});

export const { clearUserState } = userSlice.actions;

export const selectUser = state => state.user;

export default userSlice.reducer;