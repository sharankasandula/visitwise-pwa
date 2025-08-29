import { configureStore } from "@reduxjs/toolkit";
import patientsSlice from "./slices/patientsSlice";
import visitsSlice from "./slices/visitsSlice";
import earningsSlice from "./slices/earningsSlice";
import authSlice from "./slices/authSlice";
import paymentsSlice from "./slices/paymentsSlice";
import themeSlice from "./slices/themeSlice";
import mediaSlice from "./slices/mediaSlice";

export const store = configureStore({
  reducer: {
    patients: patientsSlice,
    visits: visitsSlice,
    earnings: earningsSlice,
    auth: authSlice,
    payments: paymentsSlice,
    theme: themeSlice,
    media: mediaSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
