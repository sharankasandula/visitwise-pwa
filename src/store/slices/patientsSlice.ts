import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  updateDoc,
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

// export async function addTestPatient() {
//   try {
//     const patient = {
//       name: "John Doe",
//       phone: "9848022338",
//       addressCoordinates: "12.9715987,77.594566",
//       googleMapsLink: "https://maps.google.com/?q=12.9715987,77.594566",
//       chargePerVisit: 500,
//       totalPackage: 1000,
//       condition: "back pain",
//       protocol: "daily exercises",
//       notes: "Patient needs to follow up weekly.",
//       isActive: true,
//       createdAt: "2025-08-11T12:25:02.065Z",
//       dailyVisitReminderEnabled: true,
//       paymentCollectionReminderEnabled: true,
//       followUpReminderEnabled: true,
//       followUpReminderDays: 10,
//     };
//     const docRef = await addDoc(collection(db, "patients"), patient);
//     console.log("Patient added with ID:", docRef.id);
//   } catch (error) {
//     console.error("Error adding patient:", error);
//   }
// }

const patientsSlice = createSlice({
  name: "patients",
  initialState: {
    patients: [] as Patient[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload);
    },
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
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
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
        searchPatients.fulfilled,
        (state, action: PayloadAction<Patient[]>) => {
          state.loading = false;
          state.patients = action.payload;
        }
      )
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch patients";
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch patients";
      });
  },
});

export const {
  addPatient,
  updatePatient,
  deletePatient,
  setLoading,
  setError,
} = patientsSlice.actions;
export default patientsSlice.reducer;
