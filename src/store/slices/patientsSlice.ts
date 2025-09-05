import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { RootState } from "../index";
import { Payment, NewPayment } from "./paymentsSlice";

export interface Patient {
  id: string;
  userId: string;
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

// Helper function to get current user ID from state
const getCurrentUserId = (state: RootState) => {
  return state.auth.user?.id;
};

// Helper function to convert Firestore data to serializable format
const convertFirestorePatient = (doc: any): Patient => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    name: data.name || "",
    age: data.age || null,
    gender: data.gender || "",
    phone: data.phone || null,
    addressCoordinates: data.addressCoordinates || "",
    googleMapsLink: data.googleMapsLink || "",
    chargePerVisit: Number(data.chargePerVisit) || 0,
    condition: data.condition || "",
    protocol: data.protocol || "",
    notes: data.notes || "",
    isActive: data.isActive || false,
    createdAt: data.createdAt || new Date().toISOString(),
    dailyVisitReminderEnabled: data.dailyVisitReminderEnabled || false,
    paymentCollectionReminderEnabled:
      data.paymentCollectionReminderEnabled || false,
    followUpReminderEnabled: data.followUpReminderEnabled || false,
    followUpReminderDays: Number(data.followUpReminderDays) || 0,
  };
};

export const addPatientAsync = createAsyncThunk(
  "patients/addPatientAsync",
  async (data: Omit<NewPatient, "userId">, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getCurrentUserId(state);

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const createdAt = new Date().toISOString();
      const payload = {
        ...data,
        chargePerVisit: Number(data.chargePerVisit) || 0,
        followUpReminderDays: Number(data.followUpReminderDays) || 0,
        userId,
        createdAt,
      };
      const docRef = await addDoc(collection(db, "patients"), payload);
      return { id: docRef.id, ...payload } as Patient;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to add patient");
    }
  }
);

export const updatePatientAsync = createAsyncThunk(
  "patients/updatePatientAsync",
  async (data: Patient, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getCurrentUserId(state);

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Verify the patient belongs to the current user
      if (data.userId !== userId) {
        throw new Error("Unauthorized access to patient");
      }

      const { id, ...updateData } = data;
      const patientRef = doc(db, "patients", id);

      // Ensure numeric fields are properly converted
      const updatePayload = {
        ...updateData,
        chargePerVisit: Number(updateData.chargePerVisit) || 0,
        followUpReminderDays: Number(updateData.followUpReminderDays) || 0,
      };

      await updateDoc(patientRef, updatePayload);
      return { ...data, ...updatePayload };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to update patient");
    }
  }
);

export const deletePatientAsync = createAsyncThunk(
  "patients/deletePatientAsync",
  async (patientId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getCurrentUserId(state);

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Get the patient first to verify ownership
      const patientsRef = collection(db, "patients");
      const q = query(
        patientsRef,
        where("userId", "==", userId),
        where("id", "==", patientId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("Patient not found or unauthorized access");
      }

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
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getCurrentUserId(state);

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const patientsRef = collection(db, "patients");
      const q = query(patientsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(convertFirestorePatient);
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to fetch patients");
    }
  }
);

export const searchPatients = createAsyncThunk(
  "patients/searchPatients",
  async (searchTerm: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const userId = getCurrentUserId(state);

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const patientsRef = collection(db, "patients");
      const q = query(patientsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const patients = snapshot.docs.map(convertFirestorePatient);

      return patients.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to search patients");
    }
  }
);

// List payments for a patient
export const listPayments = createAsyncThunk(
  "patients/listPayments",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const paymentsRef = collection(db, `patients/${patientId}/payments`);
      const q = query(paymentsRef);
      const snapshot = await getDocs(q);
      const payments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Payment[];

      return { patientId, payments };
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to fetch payments");
    }
  }
);

// Create a payment for a patient
export const createPayment = createAsyncThunk(
  "patients/createPayment",
  async (
    {
      patientId,
      payload,
    }: { patientId: string; payload: Omit<NewPayment, "patientId"> },
    { rejectWithValue }
  ) => {
    try {
      const now = new Date().toISOString();
      const paymentData = {
        ...payload,
        patientId,
        amount: Number(payload.amount) || 0,
        createdAt: now,
        updatedAt: now,
      };
      const docRef = await addDoc(
        collection(db, `patients/${patientId}/payments`),
        paymentData
      );
      return { id: docRef.id, ...paymentData } as Payment;
    } catch (err: any) {
      return rejectWithValue(err?.message ?? "Failed to create payment");
    }
  }
);

export const setPatientActiveStatus = createAsyncThunk(
  "patients/setPatientActiveStatus",
  async (
    { patientId, isActive }: { patientId: string; isActive: boolean },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const userId = getCurrentUserId(state);

      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Get the patient document reference directly
      const patientRef = doc(db, "patients", patientId);

      // Update the document
      await updateDoc(patientRef, { isActive });

      return { patientId, isActive };
    } catch (err: any) {
      console.error("Error updating patient status:", err);
      return rejectWithValue(err?.message ?? "Failed to update patient status");
    }
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
    // Clear patients when user logs out
    clearPatients: (state) => {
      state.patients = [];
      state.loading = false;
      state.error = null;
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
      .addCase(setPatientActiveStatus.pending, (state) => {
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
          state.loading = false;
          const patient = state.patients.find(
            (p) => p.id === action.payload.patientId
          );
          if (patient) {
            patient.isActive = action.payload.isActive;
          }
        }
      )
      .addCase(setPatientActiveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to update patient status";
      })
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
        state.error = action.error.message || "Failed to search patients";
      });
  },
});

export const {
  updatePatient,
  deletePatient,
  setLoading,
  setError,
  clearPatients,
} = patientsSlice.actions;
export default patientsSlice.reducer;
