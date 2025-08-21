import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Archive, Navigation, Phone, DollarSign } from "lucide-react";
import { Patient, setPatientActiveStatus } from "../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { RootState } from "../store";
import CalendarStrip from "./CalendarStrip";
import PaymentModal from "./PaymentModal";

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
  };

  const handleCall = () => {
    window.open(`tel:${patient.phone}`, "_self");
  };

  const handlePatientClick = () => {
    navigate(`/patient/${patient.id}`);
  };

  return (
    <div className="bg-card rounded-lg  overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1" onClick={handlePatientClick}>
            <h3 className="font-semibold capitalize text-card-foreground cursor-pointer hover:text-primary transition-colors">
              {patient.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {patient.condition} {patient.isActive}
            </p>{" "}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="p-2 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              title="Record Payment"
            >
              <DollarSign className="w-4 h-4" />
            </button>
            <button
              onClick={handleCall}
              className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Call Patient"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={handleArchive}
              className="p-2 text-muted-foreground hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
              title="Archive Patient"
            >
              <Archive className="w-4 h-4" />
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
