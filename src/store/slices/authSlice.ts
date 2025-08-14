import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService, AuthUser } from "../../services/authService";

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Async thunks for authentication
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.signInWithGoogle();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInAnonymously = createAsyncThunk(
  "auth/signInAnonymously",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.signInAnonymously();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.signOut();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    // Check if user is already authenticated from localStorage
    const savedUser = AuthService.getCurrentUser();
    if (savedUser) {
      dispatch(setUser(savedUser));
    }

    // Set up auth state listener
    return new Promise<void>((resolve) => {
      const unsubscribe = AuthService.onAuthStateChanged((user) => {
        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(clearUser());
        }
        resolve();
      });

      // Clean up listener after initial setup
      setTimeout(() => {
        unsubscribe();
      }, 1000);
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Sign In
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Anonymous Sign In
      .addCase(signInAnonymously.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAnonymously.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signInAnonymously.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { setUser, clearUser, setLoading, setError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
