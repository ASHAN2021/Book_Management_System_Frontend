import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ apolloClient, username, password }, { rejectWithValue }) => {
    try {
      const { LOGIN } = await import('@/lib/queries');
      const { data } = await apolloClient.mutate({
        mutation: LOGIN,
        variables: { username, password },
      });
      if (!data?.login?.token) {
        throw new Error('No token');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.login.token);
      }
      return { token: data.login.token, username };
    } catch (error) {
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
      if (errorMessage === 'User not found') {
        return rejectWithValue('User not found');
      }else if (errorMessage === 'Invalid credentials') {
        return rejectWithValue('Invalid username or password');
      }else{
        return rejectWithValue('Login failed. Please try again.');
      }
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ apolloClient, username, password }, { rejectWithValue }) => {
    try {
      const { REGISTER } = await import('@/lib/queries');
      const { data } = await apolloClient.mutate({
        mutation: REGISTER,
        variables: { username, password },
      });
      if (!data?.register?.token) {
        throw new Error('No token received from server');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.register.token);
      }
      return { token: data.register.token, username };
    } catch (error) {
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message;
      if (errorMessage === 'User already exists') {
        return rejectWithValue('Username already taken.');
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },

    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.username;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.username;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { initializeAuth, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
