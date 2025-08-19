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
  MessageCircle,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
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
import PatientCalendar from "./PatientCalendar";
import VisitModal from "./VisitModal";

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
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedVisitDate, setSelectedVisitDate] = useState<Date | null>(null);
  const [isPaymentHistoryCollapsed, setIsPaymentHistoryCollapsed] =
    useState(true);
  const [isVisitHistoryCollapsed, setIsVisitHistoryCollapsed] = useState(true);
  const [isArchiving, setIsArchiving] = useState(false);

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

  const handleArchive = async () => {
    if (!patient || isArchiving) return;

    try {
      setIsArchiving(true);
      const result = await dispatch(
        setPatientActiveStatus({
          patientId: patient.id,
          isActive: !patient.isActive,
        }) as any
      );

      if (result.meta.requestStatus === "fulfilled") {
        const status = result.payload.isActive ? "activated" : "archived";
        alert(`Patient ${patient.name} has been ${status} successfully!`);
        // Update local patient state before navigating
        setPatient((prev) =>
          prev ? { ...prev, isActive: result.payload.isActive } : null
        );
        navigate("/");
      } else if (result.meta.requestStatus === "rejected") {
        alert(
          `Failed to ${patient.isActive ? "archive" : "activate"} patient: ${
            result.error?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error archiving patient:", error);
      alert(
        `Failed to ${
          patient.isActive ? "archive" : "activate"
        } patient. Please try again.`
      );
    } finally {
      setIsArchiving(false);
    }
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
    if (!patient.googleMapsLink) {
      alert("Google Maps link not available");
      return;
    }
    window.open(patient.googleMapsLink, "_blank");
  };

  const handleAddVisit = (date: Date) => {
    setSelectedVisitDate(date);
    setIsVisitModalOpen(true);
  };

  const handleWhatsAppReminder = () => {
    if (!patient.phone) {
      alert("Patient phone number is required to send WhatsApp reminder");
      return;
    }

    if (totalDue <= 0) {
      alert("No outstanding amount to send reminder for");
      return;
    }

    // Generate payment reminder message
    const message = generatePaymentReminderMessage();

    // Format phone number for WhatsApp
    let phoneNumber = patient.phone.replace(/\D/g, "");

    // If phone number doesn't start with country code (91 for India), add it
    if (phoneNumber.length === 10) {
      phoneNumber = "91" + phoneNumber;
    }

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    // Show success message
    alert(
      `WhatsApp reminder sent to ${
        patient.name
      } for ₹${totalDue.toLocaleString()} outstanding amount`
    );
  };

  const generatePaymentReminderMessage = () => {
    const patientName = patient.name;
    const outstandingAmount = totalDue.toLocaleString();
    const visitCharge = patient.chargePerVisit.toLocaleString();
    const unpaidVisits = completedVisits.filter(
      (visit) => visitPaymentStatus[visit.id] === "unpaid"
    ).length;

    let message = `Hi,\n\n`;
    message += `This is a friendly reminder regarding your outstanding payment.\n\n`;
    message += `📊 Payment Summary:\n`;
    message += `• Outstanding Amount: ₹${outstandingAmount}\n`;
    message += `• Charge per visit: ₹${visitCharge}\n`;
    message += `• Unpaid visits: ${unpaidVisits}\n\n`;
    message += `Please settle your dues at your earliest convenience.\n\n`;
    message += `Thank you for your cooperation!\n`;
    message += `Best regards,\nYour Healthcare Provider`;

    return message;
  };

  const completedVisits = patientVisits.filter((v) => v.completed);
  const totalEarned = completedVisits.length * (patient?.chargePerVisit ?? 0);
  const totalCollected = patientPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalDue = totalEarned - totalCollected;

  // Calculate which visits are paid for based on payment allocation (oldest visits first)
  const calculateVisitPaymentStatus = () => {
    const visitCharge = patient?.chargePerVisit ?? 0;
    let remainingPayment = totalCollected;
    const visitPaymentStatus: Record<string, "paid" | "unpaid"> = {};

    // Sort visits by date (oldest first) to allocate payments chronologically
    const sortedVisits = [...completedVisits].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedVisits.forEach((visit) => {
      if (remainingPayment >= visitCharge) {
        visitPaymentStatus[visit.id] = "paid";
        remainingPayment -= visitCharge;
      } else {
        visitPaymentStatus[visit.id] = "unpaid";
      }
    });

    return visitPaymentStatus;
  };

  const visitPaymentStatus = calculateVisitPaymentStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {patient.googleMapsLink && (
              <button
                onClick={() => navigate("/")}
                className=" p-2 hover:bg-primary-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-700">
                Patient Profile
              </h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleArchive}
              disabled={isArchiving}
              className={`p-2 rounded-full transition-colors ${
                isArchiving
                  ? "bg-gray-300 cursor-not-allowed"
                  : patient.isActive
                  ? "hover:bg-orange-100 text-orange-900"
                  : "hover:bg-green-100 text-green-900"
              }`}
              title={patient.isActive ? "Archive Patient" : "Activate Patient"}
            >
              <Archive
                className={`w-5 h-5 ${isArchiving ? "text-gray-500" : ""}`}
              />
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
                  <User className="h-12 w-12 text-primary border border-gray-200 rounded-full p-1" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {patient.name} ({patient.gender === "Male" ? "M" : "F"})
                  </h2>
                  <p className="text-muted-foreground capitalize text-gray-600">
                    Age: {patient.age || "N/A"} • {patient.condition} •{" "}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        patient.isActive
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-orange-100 text-orange-800 border border-orange-200"
                      }`}
                    >
                      {patient.isActive ? "Active" : "Archived"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground text-gray-500">
                    ₹ {patient.chargePerVisit.toLocaleString()} per visit
                  </p>
                  {patient.phone && (
                    <p className="text-sm text-muted-foreground text-gray-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {patient.phone}
                    </p>
                  )}
                  <div className="flex items-center gap-2"></div>
                </div>
              </div>
              <div className="flex gap-2">
                {patient.phone ? (
                  <button
                    onClick={handleCall}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-gray-700"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                    title="Phone number not available"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                )}
                {patient.googleMapsLink && (
                  <button
                    onClick={handleNavigate}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-gray-700"
                  >
                    <MapPin className="h-4 w-4" />
                    Navigate
                  </button>
                )}
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
              {patient.phone ? (
                totalDue > 0 ? (
                  <button
                    onClick={handleWhatsAppReminder}
                    className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send WhatsApp Reminder
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 px-4 bg-gray-400 text-white rounded-lg cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    title="No outstanding amount to send reminder for"
                  >
                    <MessageCircle className="w-4 h-4" />
                    No Outstanding Amount
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="w-full py-2 px-4 bg-gray-400 text-white rounded-lg cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  title="Phone number required to send WhatsApp reminder"
                >
                  <MessageCircle className="w-4 h-4" />
                  Phone Number Required
                </button>
              )}
              {totalDue <= 0 && (
                <button className="w-full py-2 px-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Clear Dues
                </button>
              )}
            </div>

            {/* Payment History */}
            <div className="border-t border-gray-200">
              <button
                onClick={() =>
                  setIsPaymentHistoryCollapsed(!isPaymentHistoryCollapsed)
                }
                className="w-full px-4 pt-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h4 className="font-semibold flex items-center gap-2 text-gray-900">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Payment History ({patientPayments.length})
                </h4>
                {isPaymentHistoryCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {!isPaymentHistoryCollapsed && (
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
              )}
            </div>
          </div>
        </div>

        {/* Visit History Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Visits
          </h3>

          {/* Calendar View */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <PatientCalendar
              visits={patientVisits}
              patientId={patient.id}
              patientName={patient.name}
              defaultCharge={patient.chargePerVisit}
              onAddVisit={handleAddVisit}
              visitPaymentStatus={visitPaymentStatus}
            />

            {/* Visits List */}
            <button
              onClick={() =>
                setIsVisitHistoryCollapsed(!isVisitHistoryCollapsed)
              }
              className="w-full px-4 pt-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">
                Visit History ({patientVisits.length})
              </h4>
              {isVisitHistoryCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {!isVisitHistoryCollapsed && (
              <div className="divide-y divide-gray-200">
                {patientVisits.map((visit) => {
                  const isPaid = visitPaymentStatus[visit.id] === "paid";
                  return (
                    <div
                      key={visit.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {format(new Date(visit.date), "EEEE, dd MMM yyyy")}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{patient?.chargePerVisit.toLocaleString() || 0}
                        </p>
                        <p className="text-xs text-gray-500">
                          {visit.notes || "No notes"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {visit.completed && (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isPaid
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-orange-100 text-orange-800 border border-orange-200"
                            }`}
                          >
                            {isPaid ? "Paid" : "Unpaid"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {patientVisits.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No visits recorded yet</p>
                  </div>
                )}
              </div>
            )}
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
            <MessageCircle className="w-5 h-5 text-yellow-600" />
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

      {/* Visit Modal */}
      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => {
          setIsVisitModalOpen(false);
          setSelectedVisitDate(null);
        }}
        selectedDate={selectedVisitDate}
        patientId={patient?.id || ""}
        patientName={patient?.name || ""}
        defaultCharge={patient?.chargePerVisit || 0}
      />
    </div>
  );
};

export default PatientProfile;
