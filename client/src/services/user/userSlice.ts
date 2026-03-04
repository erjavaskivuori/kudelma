import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  type User,
} from './userService';

type UserState = {
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'user/login',
  async ({ name, password }: { name: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginUser(name, password);
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(axiosError.response?.data?.error ?? 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (
    { name, email, password }: { name: string; email: string | undefined; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await registerUser(name, email, password);
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(axiosError.response?.data?.error ?? 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(axiosError.response?.data?.error ?? 'Logout failed');
      }
      return rejectWithValue('Logout failed');
    }
  }
);

export const refresh = createAsyncThunk(
  'user/refresh',
  async (_, { rejectWithValue }) => {
    try {
      await refreshAccessToken();
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(axiosError.response?.data?.error ?? 'Token refresh failed');
      }
      return rejectWithValue('Token refresh failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Login failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Registration failed';
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });

    // Refresh
    builder
      .addCase(refresh.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(refresh.rejected, (state) => {
        state.user = null;
        state.status = 'idle';
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
