import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Edit,
  Archive,
  Phone,
  MapPin,
  User,
  DollarSign,
  Calendar,
  Camera,
  Trash2,
  TrendingUp,
  AlertCircle,
  Bell,
  Clock,
  CheckCircle,
} from "lucide-react";
import { RootState } from "../store";
import {
  setPatientActiveStatus,
  fetchPatients,
  deletePatientAsync,
} from "../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../store/slices/visitsSlice";
import { fetchPaymentsAsync } from "../store/slices/paymentsSlice";
import PaymentModal from "./PaymentModal";

import { format } from "date-fns";

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, loading } = useSelector(
    (state: RootState) => state.patients
  );
  const { visits } = useSelector((state: RootState) => state.visits);
  const { payments } = useSelector((state: RootState) => state.payments);
  const [patient, setPatient] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const patientVisits = visits[id || ""] || [];
  const patientPayments = payments[id || ""] || [];

  useEffect(() => {
    // Try to get patient from state
    const foundPatient = patients.find((p) => p.id === id);
    if (foundPatient) {
      setPatient(foundPatient);
    } else {
      // If not found, fetch from server
      dispatch(fetchPatients() as any).then((action: any) => {
        const fetchedPatient = action.payload.find((p: any) => p.id === id);
        setPatient(fetchedPatient || null);
      });
    }
  }, [id, patients, dispatch]);

  useEffect(() => {
    if (patient?.id && !visits[patient.id]) {
      dispatch(fetchVisitsAsync(patient.id) as any);
    }
  }, [patient?.id, visits, dispatch]);

  useEffect(() => {
    if (patient?.id) {
      dispatch(fetchPaymentsAsync(patient.id) as any);
    }
  }, [patient?.id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Loading patient...</div>
      </div>
    );
  }
  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Patient not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const handleArchive = () => {
    console.log("Archiving patient:", patient.id);
    dispatch(
      setPatientActiveStatus({
        patientId: patient.id,
        isActive: !patient.isActive,
      }) as any
    );
    navigate("/");
  };

  const handleEdit = () => {
    navigate(`/edit-patient/${patient.id}`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${patient.name}? This action cannot be undone.`
      )
    ) {
      try {
        await dispatch(deletePatientAsync(patient.id) as any);
        navigate("/");
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleCall = () => {
    window.open(`tel:${patient.phone}`, "_self");
  };

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(patient.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, "_blank");
  };

  const completedVisits = patientVisits.filter((v) => v.completed);
  const totalEarned = completedVisits.length * (patient?.chargePerVisit ?? 0);
  const totalCollected = patientPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalDue = totalEarned - totalCollected;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className=" p-2 hover:bg-primary-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-700">
                Patient Profile
              </h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleArchive}
              className="p-2 hover:bg-primary-700 rounded-full transition-colors text-gray-700"
              title="Archive Patient"
            >
              <Archive className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 hover:bg-primary-700 rounded-full transition-colors text-gray-700"
              title="Edit Patient"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-600 rounded-full transition-colors text-gray-700"
              title="Delete Patient"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {patient.name} ({patient.gender})
                  </h2>
                  <p className="text-muted-foreground text-gray-600">
                    Age: {patient.age || "N/A"} • {patient.condition}
                  </p>
                  <p className="text-sm text-muted-foreground text-gray-500">
                    ₹{patient.chargePerVisit} per visit
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCall}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-gray-700"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </button>
                <button
                  onClick={handleNavigate}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-gray-700"
                >
                  <MapPin className="h-4 w-4" />
                  Navigate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Payments
          </h3>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  Total Earned
                </p>
                <p className="text-lg font-bold text-blue-700">
                  ₹{totalEarned.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-green-600 font-medium mb-1">
                  Collected
                </p>
                <p className="text-lg font-bold text-green-700">
                  ₹{totalCollected.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-orange-600 font-medium mb-1">
                  Outstanding
                </p>
                <p className="text-lg font-bold text-orange-700">
                  ₹{totalDue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Record Payment
              </button>
              <button className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Send Reminder
              </button>
              {totalDue <= 0 && (
                <button className="w-full py-2 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Clear Dues
                </button>
              )}
            </div>

            {/* Payment History */}
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold flex items-center gap-2 text-gray-900">
                <Calendar className="w-5 h-5 text-green-600" />
                Payment History
              </h4>
            </div>
            <div className="divide-y divide-gray-200">
              {patientPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(payment.date), "EEEE, dd MMM yyyy")}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {payment.method} • {payment.notes || "No notes"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      ₹{payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {patientPayments.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No payments recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visit History Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Visit History
          </h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">
                Visits ({patientVisits.length})
              </h4>
            </div>
            <div className="divide-y divide-gray-200">
              {patientVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(visit.date), "EEEE, dd MMM yyyy")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {visit.notes || "No notes"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      ₹{patient?.chargePerVisit || 0}
                    </p>
                  </div>
                </div>
              ))}
              {patientVisits.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No visits recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            Media
          </h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-2">No media uploaded yet</p>
            <p className="text-sm text-gray-400">
              Upload images or videos to track progress
            </p>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            Reminders
          </h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Daily Visit Reminder
                    </p>
                    <p className="text-sm text-gray-600">
                      Get notified about daily visits
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      patient.dailyVisitReminderEnabled
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        patient.dailyVisitReminderEnabled
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Payment Collection
                    </p>
                    <p className="text-sm text-gray-600">
                      Remind to collect payments
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      patient.paymentCollectionReminderEnabled
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        patient.paymentCollectionReminderEnabled
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Follow-up Reminder
                    </p>
                    <p className="text-sm text-gray-600">
                      Follow up after {patient.followUpReminderDays} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      patient.followUpReminderEnabled
                        ? "bg-orange-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        patient.followUpReminderEnabled
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        patientId={patient?.id || ""}
        patientName={patient?.name || ""}
      />
    </div>
  );
};

export default PatientProfile;
