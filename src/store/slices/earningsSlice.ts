import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EarningsState {
  monthlyEarnings: {
    collected: number;
    pending: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: EarningsState = {
  monthlyEarnings: {
    collected: 1600,
    pending: 1100,
    total: 2700,
  },
  loading: false,
  error: null,
};

const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    updateEarnings: (state, action: PayloadAction<{ collected: number; pending: number }>) => {
      state.monthlyEarnings.collected = action.payload.collected;
      state.monthlyEarnings.pending = action.payload.pending;
      state.monthlyEarnings.total = action.payload.collected + action.payload.pending;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { updateEarnings, setLoading, setError } = earningsSlice.actions;
export default earningsSlice.reducer;
