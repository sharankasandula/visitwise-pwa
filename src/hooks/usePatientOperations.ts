import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { fetchPatients } from "../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { fetchPaymentsAsync } from "../store/slices/paymentsSlice";
import {
  archivePatient,
  deletePatient,
  confirmDeletePatient,
} from "../services/patientService";
import {
  calculatePaymentSummary,
  generatePaymentReminderMessage,
  sendWhatsAppReminder,
} from "../utils/paymentUtils";
import { getCompletedVisits } from "../utils/visitUtils";

export interface UsePatientOperationsProps {
  patientId: string;
}

export const usePatientOperations = ({
  patientId,
}: UsePatientOperationsProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, loading } = useSelector(
    (state: RootState) => state.patients
  );
  const { visits } = useSelector((state: RootState) => state.visits);
  const { payments } = useSelector((state: RootState) => state.payments);

  const [isArchiving, setIsArchiving] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Get patient data
  const patient = patients.find((p) => p.id === patientId);
  const patientVisits = visits[patientId] || [];
  const patientPayments = payments[patientId] || [];
  const completedVisits = getCompletedVisits(patientVisits);

  // Calculate payment summary
  const paymentSummary = patient
    ? calculatePaymentSummary(
        completedVisits,
        patientPayments,
        patient.chargePerVisit
      )
    : { totalEarned: 0, totalCollected: 0, totalDue: 0, unpaidVisits: 0 };

  // Archive patient handler
  const handleArchive = async () => {
    if (!patient || isArchiving) return;

    if (patient.isActive) {
      // Show follow-up reminder modal when archiving
      setIsFollowUpModalOpen(true);
    } else {
      // Directly restore when unarchiving
      setIsArchiving(true);
      const success = await archivePatient({
        patientId: patient.id,
        isActive: true,
        dispatch,
        onSuccess: (message) => {
          alert(message);
          navigate("/");
        },
        onError: (error) => alert(error),
      });
      setIsArchiving(false);
    }
  };

  // Follow-up confirmation handler
  const handleFollowUpConfirm = async (days: number) => {
    if (!patient) return;

    setIsArchiving(true);
    const success = await archivePatient({
      patientId: patient.id,
      isActive: false,
      dispatch,
      onSuccess: (message) => {
        alert(
          `Patient ${patient.name} has been archived with a ${days}-day follow-up reminder!`
        );
        navigate("/");
      },
      onError: (error) => alert(error),
    });
    setIsArchiving(false);
    setIsFollowUpModalOpen(false);
  };

  // Edit patient handler
  const handleEdit = () => {
    navigate(`/edit-patient/${patientId}`);
  };

  // Delete patient handler
  const handleDelete = () => {
    if (!patient) return;

    confirmDeletePatient(patient.name, async () => {
      const success = await deletePatient({
        patientId: patient.id,
        patientName: patient.name,
        dispatch,
        onSuccess: () => navigate("/"),
        onError: (error) => alert(error),
      });
    });
  };

  // WhatsApp reminder handler
  const handleWhatsAppReminder = () => {
    if (!patient) return;

    if (paymentSummary.totalDue <= 0) {
      alert("No outstanding amount to send reminder for");
      return;
    }

    const message = generatePaymentReminderMessage(
      patient.name,
      paymentSummary.totalDue,
      patient.chargePerVisit,
      paymentSummary.unpaidVisits
    );

    sendWhatsAppReminder(patient.phone || "", message);
  };

  // Load patient data if not found
  const loadPatientData = async () => {
    if (!patient) {
      await dispatch(fetchPatients() as any);
    }
    if (patient?.id && !visits[patient.id]) {
      dispatch(fetchVisitsAsync(patient.id) as any);
    }
    if (patient?.id) {
      dispatch(fetchPaymentsAsync(patient.id) as any);
    }
  };

  return {
    patient,
    patientVisits,
    patientPayments,
    completedVisits,
    paymentSummary,
    loading,
    isArchiving,
    isFollowUpModalOpen,
    setIsFollowUpModalOpen,
    handleArchive,
    handleFollowUpConfirm,
    handleEdit,
    handleDelete,
    handleWhatsAppReminder,
    loadPatientData,
  };
};
