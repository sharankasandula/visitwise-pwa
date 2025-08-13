import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Archive, Navigation, Phone } from "lucide-react";
import { Patient, setPatientActiveStatus } from "../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { RootState } from "../store";
import CalendarStrip from "./CalendarStrip";

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits } = useSelector((state: RootState) => state.visits);

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1" onClick={handlePatientClick}>
            <h3 className="font-semibold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors">
              {patient.name}
            </h3>
            <p className="text-sm text-gray-600">{patient.condition}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCall}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Call Patient"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={handleArchive}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
              title="Archive Patient"
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>

        <CalendarStrip patientId={patient.id} />
      </div>
    </div>
  );
};

export default PatientCard;
