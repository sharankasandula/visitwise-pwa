import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  completed: boolean;
  notes?: string;
  paymentReceived?: number;
}

interface VisitsState {
  visits: Visit[];
  loading: boolean;
  error: string | null;
}

const initialState: VisitsState = {
  visits: [
    { id: '1', patientId: '1', date: '2024-01-15', completed: true, paymentReceived: 500 },
    { id: '2', patientId: '1', date: '2024-01-16', completed: true, paymentReceived: 500 },
    { id: '3', patientId: '2', date: '2024-01-15', completed: true, paymentReceived: 600 },
    { id: '4', patientId: '1', date: '2024-01-17', completed: false },
    { id: '5', patientId: '2', date: '2024-01-18', completed: false },
  ],
  loading: false,
  error: null,
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    addVisit: (state, action: PayloadAction<Visit>) => {
      state.visits.push(action.payload);
    },
    updateVisit: (state, action: PayloadAction<Visit>) => {
      const index = state.visits.findIndex(v => v.id === action.payload.id);
      if (index !== -1) {
        state.visits[index] = action.payload;
      }
    },
    markVisitCompleted: (state, action: PayloadAction<{ visitId: string; paymentReceived?: number }>) => {
      const visit = state.visits.find(v => v.id === action.payload.visitId);
      if (visit) {
        visit.completed = true;
        if (action.payload.paymentReceived) {
          visit.paymentReceived = action.payload.paymentReceived;
        }
      }
    },
    toggleVisitForDate: (state, action: PayloadAction<{ patientId: string; date: string }>) => {
      const existingVisit = state.visits.find(
        v => v.patientId === action.payload.patientId && v.date === action.payload.date
      );
      
      if (existingVisit) {
        existingVisit.completed = !existingVisit.completed;
      } else {
        state.visits.push({
          id: Date.now().toString(),
          patientId: action.payload.patientId,
          date: action.payload.date,
          completed: true,
        });
      }
    },
  },
});

export const { addVisit, updateVisit, markVisitCompleted, toggleVisitForDate } = visitsSlice.actions;
export default visitsSlice.reducer;
