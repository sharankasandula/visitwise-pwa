import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  Navigation,
  Phone,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Patient, setPatientActiveStatus } from "../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { fetchPaymentsAsync } from "../store/slices/paymentsSlice";
import { RootState } from "../store";
import CalendarStrip from "./CalendarStrip";
import PaymentModal from "./PaymentModal";
import { FollowUpReminderModal } from "./modals";
import { showSuccess, showInfo } from "../utils/toast";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits } = useSelector((state: RootState) => state.visits);
  const { payments } = useSelector((state: RootState) => state.payments);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Fetch visits when component mounts
  useEffect(() => {
    if (!visits[patient.id]) {
      dispatch(fetchVisitsAsync(patient.id) as any);
    }
  }, [dispatch, patient.id, visits]);

  // Fetch payments when component mounts
  useEffect(() => {
    if (!payments[patient.id]) {
      dispatch(fetchPaymentsAsync(patient.id) as any);
    }
  }, [dispatch, patient.id, payments]);

  // Calculate outstanding amount
  const outstandingAmount = useMemo(() => {
    const patientVisits = visits[patient.id] || [];
    const patientPayments = payments[patient.id] || [];

    const totalCharges = patientVisits.reduce(
      (sum, visit) => sum + visit.charge,
      0
    );
    const totalPayments = patientPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    return totalCharges - totalPayments;
  }, [visits, payments, patient.id]);

  const handleArchive = () => {
    if (patient.isActive) {
      // Show follow-up reminder modal when archiving
      setIsFollowUpModalOpen(true);
    } else {
      // Directly restore when unarchiving
      dispatch(
        setPatientActiveStatus({
          patientId: patient.id,
          isActive: true,
        }) as any
      );
      showSuccess(
        "Patient Restored",
        `${patient.name} has been restored to active patients.`
      );
    }
  };

  const handleFollowUpConfirm = (days: number) => {
    // Archive the patient
    dispatch(
      setPatientActiveStatus({
        patientId: patient.id,
        isActive: false,
      }) as any
    );

    showInfo(
      "Patient Archived",
      `${patient.name} has been moved to archived patients with a ${days}-day follow-up reminder.`
    );

    setIsFollowUpModalOpen(false);
  };

  const handleCall = () => {
    window.open(`tel:${patient.phone}`, "_self");
  };

  const handlePatientClick = () => {
    navigate(`/patient/${patient.id}`);
  };

  return (
    <div className="bg-accent/20 rounded-lg  overflow-hidden">
      <div className="p-4 lg:p-6 xl:p-8 ">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1" onClick={handlePatientClick}>
            <h3 className="font-semibold capitalize text-card-foreground cursor-pointer hover:text-primary transition-colors ellipsis">
              {patient.name.length > 20
                ? `${patient.name.slice(0, 20)}...`
                : patient.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {patient.condition.length > 15
                ? `${patient.condition.slice(0, 15)}...`
                : patient.condition}
              {patient.isActive}
            </p>
            {outstandingAmount > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-warning" />
                <span className="text-xs text-warning font-medium">
                  Outstanding: ₹{outstandingAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center text-card-foreground rounded-lg gap-2">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              title="Record Payment"
              aria-label="Record Payment"
              className="inline-flex h-10 w-10 items-center  justify-center rounded-full leading-none
               hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
               active:scale-95 motion-reduce:active:scale-100"
            >
              <DollarSign
                className="size-5 block shrink-0 pointer-events-none"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={handleCall}
              title="Call Patient"
              aria-label="Call Patient"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full leading-none
               hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
               active:scale-95 motion-reduce:active:scale-100"
            >
              <Phone
                className="size-5 block shrink-0 pointer-events-none"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={handleArchive}
              title="Archive Patient"
              aria-label="Archive Patient"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full leading-none
               hover:bg-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
               active:scale-95 motion-reduce:active:scale-100"
            >
              <Archive
                className="size-5 block shrink-0 pointer-events-none"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <CalendarStrip patientId={patient.id} />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        patientId={patient.id}
        patientName={patient.name}
      />

      {/* Follow-up Reminder Modal */}
      <FollowUpReminderModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onConfirm={handleFollowUpConfirm}
        patientName={patient.name}
      />
    </div>
  );
};

export default PatientCard;
