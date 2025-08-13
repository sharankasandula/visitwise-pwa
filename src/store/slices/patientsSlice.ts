import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export interface Patient {
  id: string;
  name: string;
  age: number | null;
  gender: string;
  phone: string | null;
  addressCoordinates: string;
  googleMapsLink: string;
  chargePerVisit: number;
  condition: string;
  protocol: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  dailyVisitReminderEnabled: boolean;
  paymentCollectionReminderEnabled: boolean;
  followUpReminderEnabled: boolean;
  followUpReminderDays: number;
}

interface PatientsState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

export type NewPatient = Omit<Patient, "id" | "createdAt">;

export const addPatientAsync = createAsyncThunk(
  "patients/addPatientAsync",
  async (data: NewPatient, { rejectWithValue }) => {
    try {
      const createdAt = new Date().toISOString();
      const payload = { ...data, createdAt };
      const docRef = await addDoc(collection(db, "patients"), payload);
      return { id: docRef.id, ...payload } as Patient;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to add patient");
    }
  }
);

export const updatePatientAsync = createAsyncThunk(
  "patients/updatePatientAsync",
  async (data: Patient, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = data;
      const patientRef = doc(db, "patients", id);
      await updateDoc(patientRef, updateData);
      return data;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to update patient");
    }
  }
);

export const deletePatientAsync = createAsyncThunk(
  "patients/deletePatientAsync",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const patientRef = doc(db, "patients", patientId);
      await deleteDoc(patientRef);
      return patientId;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to delete patient");
    }
  }
);

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async () => {
    const snapshot = await getDocs(collection(db, "patients"));
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Patient)
    );
  }
);

export const searchPatients = createAsyncThunk(
  "patients/searchPatients",
  async (searchTerm: string) => {
    const snapshot = await getDocs(collection(db, "patients"));
    const patients = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Patient)
    );
    return patients.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
);

export const setPatientActiveStatus = createAsyncThunk(
  "patients/setPatientActiveStatus",
  async ({ patientId, isActive }: { patientId: string; isActive: boolean }) => {
    const patientRef = doc(db, "patients", patientId);
    await updateDoc(patientRef, { isActive });
    return { patientId, isActive };
  }
);

const patientsSlice = createSlice({
  name: "patients",
  initialState: {
    patients: [] as Patient[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((p) => p.id !== action.payload);
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
      .addCase(addPatientAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatientAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addPatientAsync.fulfilled,
        (state, action: PayloadAction<Patient>) => {
          state.loading = false;
          const id = action.payload.id;
          if (!state.patients.some((p) => p.id === id)) {
            state.patients.push(action.payload);
          }
        }
      )
      .addCase(
        updatePatientAsync.fulfilled,
        (state, action: PayloadAction<Patient>) => {
          state.loading = false;
          const index = state.patients.findIndex(
            (p) => p.id === action.payload.id
          );
          if (index !== -1) {
            state.patients[index] = action.payload;
          }
        }
      )
      .addCase(
        setPatientActiveStatus.fulfilled,
        (
          state,
          action: PayloadAction<{ patientId: string; isActive: boolean }>
        ) => {
          const patient = state.patients.find(
            (p) => p.id === action.payload.patientId
          );
          if (patient) {
            patient.isActive = action.payload.isActive;
          }
        }
      )
      .addCase(
        fetchPatients.fulfilled,
        (state, action: PayloadAction<Patient[]>) => {
          state.loading = false;
          state.patients = action.payload;
        }
      )
      .addCase(
        deletePatientAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.patients = state.patients.filter(
            (p) => p.id !== action.payload
          );
        }
      )
      .addCase(
        searchPatients.fulfilled,
        (state, action: PayloadAction<Patient[]>) => {
          state.loading = false;
          state.patients = action.payload;
        }
      )
      .addCase(addPatientAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to add patient";
      })
      .addCase(updatePatientAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update patient";
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch patients";
      })

      .addCase(deletePatientAsync.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to delete patient";
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch patients";
      });
  },
});

export const { updatePatient, deletePatient, setLoading, setError } =
  patientsSlice.actions;
export default patientsSlice.reducer;
