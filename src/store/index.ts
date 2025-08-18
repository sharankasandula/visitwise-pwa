import { configureStore } from "@reduxjs/toolkit";
import patientsSlice from "./slices/patientsSlice";
import visitsSlice from "./slices/visitsSlice";
import earningsSlice from "./slices/earningsSlice";
import authSlice from "./slices/authSlice";
import paymentsSlice from "./slices/paymentsSlice";

export const store = configureStore({
  reducer: {
    patients: patientsSlice,
    visits: visitsSlice,
    earnings: earningsSlice,
    auth: authSlice,
    payments: paymentsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
