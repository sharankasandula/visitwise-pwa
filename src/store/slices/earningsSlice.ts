import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EarningsState {
  loading: boolean;
  error: string | null;
}

const initialState: EarningsState = {
  loading: false,
  error: null,
};

const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = earningsSlice.actions;
export default earningsSlice.reducer;
