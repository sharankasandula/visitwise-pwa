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

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  completed: boolean;
  notes?: string;
  paymentReceived?: number;
  createdAt: string;
  updatedAt: string;
}

export type NewVisit = Omit<Visit, "id" | "createdAt" | "updatedAt">;

interface VisitsState {
  visits: Record<string, Visit[]>; // Keyed by patientId
  loading: boolean;
  error: string | null;
}

const initialState: VisitsState = {
  visits: {},
  loading: false,
  error: null,
};

// Helper function to convert Firestore data to serializable format
const convertFirestoreVisit = (doc: any): Visit => {
  const data = doc.data();
  return {
    id: doc.id,
    patientId: data.patientId,
    date:
      typeof data.date === "string"
        ? data.date
        : data.date?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    completed: data.completed || false,
    notes: data.notes || "",
    paymentReceived: data.paymentReceived || 0,
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

// Create a new visit
export const createVisitAsync = createAsyncThunk(
  "visits/createVisitAsync",
  async (data: NewVisit, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const visitData = { ...data, createdAt: now, updatedAt: now };
      const docRef = await addDoc(
        collection(db, `patients/${data.patientId}/visits`),
        visitData
      );
      return { id: docRef.id, ...visitData } as Visit;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to create visit");
    }
  }
);

// Fetch visits for a specific patient
export const fetchVisitsAsync = createAsyncThunk(
  "visits/fetchVisitsAsync",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const visitsRef = collection(db, `patients/${patientId}/visits`);
      const q = query(visitsRef, orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const visits = snapshot.docs.map(convertFirestoreVisit);

      return { patientId, visits };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to fetch visits");
    }
  }
);

// Update a visit
export const updateVisitAsync = createAsyncThunk(
  "visits/updateVisitAsync",
  async (data: Visit, { rejectWithValue }) => {
    try {
      const { id, patientId, ...updateData } = data;
      const visitRef = doc(db, `patients/${patientId}/visits`, id);
      const now = new Date().toISOString();
      await updateDoc(visitRef, { ...updateData, updatedAt: now });
      return { ...data, updatedAt: now };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to update visit");
    }
  }
);

// Delete a visit
export const deleteVisitAsync = createAsyncThunk(
  "visits/deleteVisitAsync",
  async (
    { patientId, visitId }: { patientId: string; visitId: string },
    { rejectWithValue }
  ) => {
    try {
      const visitRef = doc(db, `patients/${patientId}/visits`, visitId);
      await deleteDoc(visitRef);
      return { patientId, visitId };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to delete visit");
    }
  }
);

const visitsSlice = createSlice({
  name: "visits",
  initialState,
  reducers: {
    clearVisits: (state, action: PayloadAction<string>) => {
      delete state.visits[action.payload];
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
      // Create Visit
      .addCase(createVisitAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createVisitAsync.fulfilled,
        (state, action: PayloadAction<Visit>) => {
          state.loading = false;
          const { patientId } = action.payload;
          if (!state.visits[patientId]) {
            state.visits[patientId] = [];
          }
          const existingIndex = state.visits[patientId].findIndex(
            (v) => v.id === action.payload.id
          );
          if (existingIndex !== -1) {
            state.visits[patientId][existingIndex] = action.payload;
          } else {
            state.visits[patientId].push(action.payload);
          }
        }
      )
      .addCase(createVisitAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create visit";
      })

      // Fetch Visits
      .addCase(fetchVisitsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVisitsAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ patientId: string; visits: Visit[] }>
        ) => {
          state.loading = false;
          const { patientId, visits } = action.payload;
          state.visits[patientId] = visits;
        }
      )
      .addCase(fetchVisitsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch visits";
      })

      // Update Visit
      .addCase(updateVisitAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateVisitAsync.fulfilled,
        (state, action: PayloadAction<Visit>) => {
          state.loading = false;
          const { patientId, id } = action.payload;
          if (state.visits[patientId]) {
            const index = state.visits[patientId].findIndex((v) => v.id === id);
            if (index !== -1) {
              state.visits[patientId][index] = action.payload;
            }
          }
        }
      )
      .addCase(updateVisitAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update visit";
      })

      // Delete Visit
      .addCase(deleteVisitAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteVisitAsync.fulfilled,
        (
          state,
          action: PayloadAction<{ patientId: string; visitId: string }>
        ) => {
          state.loading = false;
          const { patientId, visitId } = action.payload;
          if (state.visits[patientId]) {
            state.visits[patientId] = state.visits[patientId].filter(
              (v) => v.id !== visitId
            );
          }
        }
      )
      .addCase(deleteVisitAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete visit";
      });
  },
});

export const { clearVisits, setLoading, setError } = visitsSlice.actions;
export default visitsSlice.reducer;
