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
import WhatsAppIcon from "./ui/icons/WhatsAppIcon";

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
  const [expandedNotes, setExpandedNotes] = useState(false);

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
        <div className="text-center text-muted-foreground">
          <img
            src="./illustrations/physio_illustration1.png"
            alt="Loading"
            className="w-24 h-24"
          />
          <p>Loading patient info...</p>
        </div>
      </div>
    );
  }
  if (!patient) {
    return (
      <div className="min-h-screen bg-card flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Patient not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-primary text-primary-foreground"
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
    // alert(
    //   `WhatsApp reminder sent to ${
    //     patient.name
    //   } for ₹${totalDue.toLocaleString()} outstanding amount`
    // );
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
    <div className="min-h-screen ">
      {/* Header */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className=" p-2 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl font-bold">Patient Profile</h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleArchive}
              disabled={isArchiving}
              className={"p-2 rounded-full transition-colors"}
              title={patient.isActive ? "Archive Patient" : "Activate Patient"}
            >
              <Archive className={`w-5 h-5`} />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 rounded-full transition-colors"
              title="Edit Patient"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full transition-colors"
              title="Delete Patient"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Patient Info Card */}
        <div className="rounded-lg bg-card border border-border text-card-foreground">
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary-foreground text-secondary rounded-full flex items-center justify-center">
                  <span className="text-5xl">
                    {patient.gender === "Male"
                      ? "👨"
                      : patient.gender === "Female"
                      ? "👩"
                      : "⚧️"}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold capitalize">
                    {patient.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Age: {patient.age || "N/A"} • ₹{" "}
                    {patient.chargePerVisit.toLocaleString()} per visit •{" "}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        patient.isActive
                          ? "bg-success text-success-foreground border border-success"
                          : "bg-warning text-warning-foreground border border-warning"
                      }`}
                    >
                      {patient.isActive ? "Active" : "Archived"}
                    </span>
                  </p>
                  {/* Condition Field */}
                  <p className="text-sm text-muted-foreground capitalize">
                    <span className="font-medium">Condition:</span>{" "}
                    {patient.condition}
                  </p>

                  {/* Protocol Field */}
                  {patient.protocol && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Protocol:</span>{" "}
                      {patient.protocol}
                    </p>
                  )}

                  {/* Notes Field with Expand/Collapse */}
                  {patient.notes && (
                    <div className="">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span>{" "}
                        {expandedNotes ? (
                          <span>{patient.notes}</span>
                        ) : (
                          <span>
                            {patient.notes.length > 15
                              ? `${patient.notes.substring(0, 15)}...`
                              : patient.notes}
                          </span>
                        )}
                        {patient.notes.length > 15 && (
                          <span
                            role="button"
                            tabIndex={0}
                            aria-expanded={expandedNotes}
                            onClick={() => setExpandedNotes(!expandedNotes)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setExpandedNotes((v) => !v);
                              }
                            }}
                            className="ml-1 inline cursor-pointer select-none text-[11px] leading-none align-baseline
               text-secondary underline underline-offset-2 focus:outline-none focus:ring-1 focus:ring-primary/60 rounded-sm
               hover:no-underline"
                          >
                            {expandedNotes ? "Show less" : "Show more"}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2"></div>
                </div>
              </div>
              <div className="flex gap-2">
                {patient.phone ? (
                  <button
                    onClick={handleCall}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors "
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg text-muted-foreground cursor-not-allowed"
                    title="Phone number not available"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                )}
                {patient.googleMapsLink ? (
                  <button
                    onClick={handleNavigate}
                    className="flex items-center gap-2 px-4 py-2 border  rounded-lg  transition-colors "
                  >
                    <MapPin className="h-4 w-4" />
                    Navigate
                  </button>
                ) : (
                  <button
                    disabled
                    title="Location unavailable"
                    className="flex items-center gap-2 px-4 py-2 border text-muted-foreground rounded-lg  transition-colors "
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
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            Payments
          </h3>

          {/* Payment Summary */}
          <div className="rounded-lg bg-card border border-border text-card-foreground  p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs font-medium mb-1">Total Earned</p>
                <p className="text-lg font-bold ">
                  ₹{totalEarned.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium mb-1">Collected</p>
                <p className="text-lg font-bold ">
                  ₹{totalCollected.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs  font-medium mb-1">Outstanding</p>
                <p className="text-lg font-bold">
                  ₹{totalDue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4 " />
                Record Payment
              </button>
              {patient.phone ? (
                totalDue > 0 ? (
                  <button
                    onClick={handleWhatsAppReminder}
                    className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    Send WhatsApp Reminder
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    title="No outstanding amount to send reminder for"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    No Outstanding Amount
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="w-full py-2 px-4 bg-accent text-accent-foreground  rounded-lg cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  title="Phone number required to send WhatsApp reminder"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  Phone Number Required
                </button>
              )}
              {totalDue > 0 && (
                <button
                  onClick={() => {
                    setIsPaymentModalOpen(true);
                    setSelectedVisitDate(null);
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-accent text-accent-foreground transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Clear Dues (₹{totalDue.toLocaleString()})
                </button>
              )}
            </div>

            {/* Payment History */}
            <div className="">
              {patientPayments.length > 0 && (
                <button
                  onClick={() =>
                    setIsPaymentHistoryCollapsed(!isPaymentHistoryCollapsed)
                  }
                  className="w-full px-4 pt-4 flex items-center justify-between transition-colors"
                >
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Payment History ({patientPayments.length})
                  </h4>
                  {isPaymentHistoryCollapsed ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              )}

              {!isPaymentHistoryCollapsed && (
                <div className="divide-y">
                  {patientPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {format(new Date(payment.date), "EEEE, dd MMM yyyy")}
                        </p>
                        <p className="text-sm capitalize">
                          {payment.method} • {payment.notes || "No notes"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {patientPayments.length === 0 && (
                    <div className="p-8 text-center">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 text-warning" />
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
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Visits
          </h3>

          {/* Calendar View */}
          <div className="rounded-lg bg-card border border-border text-card-foreground p-4">
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
              className="w-full px-4 pt-4  flex items-center justify-between transition-colors"
            >
              <h4 className="font-semibold">
                Visit History ({patientVisits.length})
              </h4>
              {isVisitHistoryCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {!isVisitHistoryCollapsed && (
              <div className="divide-y">
                {patientVisits.map((visit) => {
                  const isPaid = visitPaymentStatus[visit.id] === "paid";
                  return (
                    <div
                      key={visit.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium ">
                          {format(new Date(visit.date), "EEEE, dd MMM yyyy")}
                        </p>
                        <p className="text-xs">
                          ₹{patient?.chargePerVisit.toLocaleString() || 0}
                        </p>
                        <p className="text-xs">{visit.notes || "No notes"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {visit.completed && (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isPaid
                                ? "bg-success text-success border border-success"
                                : "bg-warning-100 text-warning-800 border border-warning-200"
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
                  <div className="p-8 text-center ">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <p>No visits recorded yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Media Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold  flex items-center gap-2">
            <Camera className="w-5 h-5 text-pink-400" />
            Media
          </h3>
          <div className="rounded-lg bg-card border border-border text-card-foreground  p-8 text-center">
            <Camera className="w-12 h-12 mx-auto mb-4 text-pink-400" />
            <img
              src="./illustrations/physio_illustration1.png"
              alt="No Media"
              className="w-auto h-auto"
            />
            <p className="mb-2">No media uploaded yet</p>
            <p className="text-sm text-muted-foreground">
              Upload images or videos to track progress
            </p>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold  flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-yellow-600" />
            Reminders
          </h3>
          <div className="rounded-lg bg-card border border-border text-card-foreground p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3  rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Daily Visit Reminder</p>
                    <p className="text-sm">Get notified about daily visits</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {patient.dailyVisitReminderEnabled ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      On
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
                      Off
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Collection</p>
                    <p className="text-sm">Remind to collect payments</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {patient.paymentCollectionReminderEnabled ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      On
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
                      Off
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning-600" />
                  </div>
                  <div>
                    <p className="font-medium">Follow-up Reminder</p>
                    <p className="text-sm">
                      Follow up after{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                        {patient.followUpReminderDays} days
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {patient.followUpReminderEnabled ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                      On
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
                      Off
                    </span>
                  )}
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
