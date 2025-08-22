import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Archive, Navigation, Phone, DollarSign } from "lucide-react";
import { Patient, setPatientActiveStatus } from "../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { RootState } from "../store";
import CalendarStrip from "./CalendarStrip";
import PaymentModal from "./PaymentModal";
import { showSuccess, showInfo } from "../utils/toast";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits } = useSelector((state: RootState) => state.visits);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Fetch visits when component mounts
  useEffect(() => {
    if (!visits[patient.id]) {
      dispatch(fetchVisitsAsync(patient.id) as any);
    }
  }, [dispatch, patient.id, visits]);

  const handleArchive = () => {
    dispatch(
      setPatientActiveStatus({
        patientId: patient.id,
        isActive: !patient.isActive,
      }) as any
    );

    if (patient.isActive) {
      showInfo(
        "Patient Archived",
        `${patient.name} has been moved to archived patients.`
      );
    } else {
      showSuccess(
        "Patient Restored",
        `${patient.name} has been restored to active patients.`
      );
    }
  };

  const handleCall = () => {
    window.open(`tel:${patient.phone}`, "_self");
  };

  const handlePatientClick = () => {
    navigate(`/patient/${patient.id}`);
  };

  return (
    <div className="bg-card rounded-lg  overflow-hidden">
      <div className="py-4 px-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1" onClick={handlePatientClick}>
            <h3 className="font-semibold capitalize text-card-foreground cursor-pointer hover:text-primary transition-colors">
              {patient.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {patient.condition} {patient.isActive}
            </p>{" "}
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
    </div>
  );
};

export default PatientCard;
