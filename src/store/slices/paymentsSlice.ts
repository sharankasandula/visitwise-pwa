import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  date: string;
  method: "cash" | "upi" | "card" | "other";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewPayment = Omit<Payment, "id" | "createdAt" | "updatedAt">;

interface PaymentsState {
  payments: Record<string, Payment[]>; // Keyed by patientId
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  payments: {},
  loading: false,
  error: null,
};

// Helper function to convert Firestore data to serializable format
const convertFirestorePayment = (doc: any): Payment => {
  const data = doc.data();
  return {
    id: doc.id,
    patientId: data.patientId,
    amount: Number(data.amount) || 0,
    date:
      typeof data.date === "string"
        ? data.date
        : data.date?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    method: data.method || "cash",
    notes: data.notes || "",
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : typeof data.createdAt === "string"
        ? data.createdAt
        : new Date().toISOString(),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : typeof data.updatedAt === "string"
        ? data.updatedAt
        : new Date().toISOString(),
  };
};

// Create a new payment
export const createPaymentAsync = createAsyncThunk(
  "payments/createPaymentAsync",
  async (data: NewPayment, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const paymentData = {
        ...data,
        amount: Number(data.amount) || 0,
        createdAt: now,
        updatedAt: now,
      };
      const docRef = await addDoc(
        collection(db, `patients/${data.patientId}/payments`),
        paymentData
      );
      return { id: docRef.id, ...paymentData } as Payment;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to create payment");
    }
  }
);

// Fetch payments for a specific patient
export const fetchPaymentsAsync = createAsyncThunk(
  "payments/fetchPaymentsAsync",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const paymentsRef = collection(db, `patients/${patientId}/payments`);
      const q = query(paymentsRef, orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const payments = snapshot.docs.map(convertFirestorePayment);

      return { patientId, payments };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to fetch payments");
    }
  }
);

// Update a payment
export const updatePaymentAsync = createAsyncThunk(
  "payments/updatePaymentAsync",
  async (data: Payment, { rejectWithValue }) => {
    try {
      const { id, patientId, ...updateData } = data;
      const paymentRef = doc(db, `patients/${patientId}/payments`, id);
      const now = new Date().toISOString();
      const updatePayload = {
        ...updateData,
        amount: Number(updateData.amount) || 0,
        updatedAt: now,
      };
      await updateDoc(paymentRef, updatePayload);
      return { ...data, ...updatePayload };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to update payment");
    }
  }
);

// Delete a payment
export const deletePaymentAsync = createAsyncThunk(
  "payments/deletePaymentAsync",
  async (
    { patientId, paymentId }: { patientId: string; paymentId: string },
    { rejectWithValue }
  ) => {
    try {
      const paymentRef = doc(db, `patients/${patientId}/payments`, paymentId);
      await deleteDoc(paymentRef);
      return { patientId, paymentId };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to delete payment");
    }
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPayments: (state, action: PayloadAction<string>) => {
      delete state.payments[action.payload];
    },
    clearAllPayments: (state) => {
      state.payments = {};
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment
      .addCase(createPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPaymentAsync.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          const { patientId } = action.payload;
          if (!state.payments[patientId]) {
            state.payments[patientId] = [];
          }
          const existingIndex = state.payments[patientId].findIndex(
            (p) => p.id === action.payload.id
          );
          if (existingIndex !== -1) {
            state.payments[patientId][existingIndex] = action.payload;
          } else {
            state.payments[patientId].push(action.payload);
          }
        }
      )
      .addCase(createPaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create payment";
      })

      // Fetch Payments
      .addCase(fetchPaymentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaymentsAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ patientId: string; payments: Payment[] }>
        ) => {
          state.loading = false;
          const { patientId, payments } = action.payload;
          state.payments[patientId] = payments;
        }
      )
      .addCase(fetchPaymentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch payments";
      })

      // Update Payment
      .addCase(updatePaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updatePaymentAsync.fulfilled,
        (state, action: PayloadAction<Payment>) => {
          state.loading = false;
          const { patientId, id } = action.payload;
          if (state.payments[patientId]) {
            const index = state.payments[patientId].findIndex(
              (p) => p.id === id
            );
            if (index !== -1) {
              state.payments[patientId][index] = action.payload;
            }
          }
        }
      )
      .addCase(updatePaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update payment";
      })

      // Delete Payment
      .addCase(deletePaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deletePaymentAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ patientId: string; paymentId: string }>
        ) => {
          state.loading = false;
          const { patientId, paymentId } = action.payload;
          if (state.payments[patientId]) {
            state.payments[patientId] = state.payments[patientId].filter(
              (p) => p.id !== paymentId
            );
          }
        }
      )
      .addCase(deletePaymentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete payment";
      });
  },
});

export const { clearPayments, clearAllPayments, setLoading, setError } =
  paymentsSlice.actions;
export default paymentsSlice.reducer;
