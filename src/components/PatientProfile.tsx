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
import EditVisitModal from "./EditVisitModal";
import EditPaymentModal from "./EditPaymentModal";
import MediaPreview from "./MediaPreview";
import MediaUpload from "./MediaUpload";
import MediaGallery from "./MediaGallery";

import { format } from "date-fns";
import WhatsAppIcon from "./ui/icons/WhatsAppIcon";
import Badge from "./ui/Badge";
import { Card, CardContent } from "./ui/Card";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { ChevronUp, ChevronDown, Navigation } from "lucide-react";

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
  const [showDetails, setShowDetails] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isMediaGalleryModalOpen, setIsMediaGalleryModalOpen] = useState(false);

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

  const handleEditVisit = (visit: any) => {
    setSelectedVisit(visit);
    setIsEditVisitModalOpen(true);
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsEditPaymentModalOpen(true);
  };

  const handleMediaUpload = () => {
    setIsMediaUploadModalOpen(true);
  };

  const handleMediaViewAll = () => {
    setIsMediaGalleryModalOpen(true);
  };

  const handleMediaUploadComplete = () => {
    // Refresh media data if needed
    // The Redux state will automatically update
  };

  // Helper functions for the new patient info card design
  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "border-blue-500 bg-blue-50 text-blue-700";
      case "female":
        return "border-pink-500 bg-pink-50 text-pink-700";
      default:
        return "border-purple-500 bg-purple-50 text-purple-700";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGenderCode = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "M";
      case "female":
        return "F";
      default:
        return "O";
    }
  };

  const truncatedNotes =
    patient.notes && patient.notes.length > 15
      ? `${patient.notes.substring(0, 15)}...`
      : patient.notes;

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
        <Card className="w-full border-border bg-card">
          <CardContent className="p-3">
            {/* Main Row */}
            <div className="flex items-center gap-3">
              <Avatar
                className={`h-10 w-10 border ${getGenderColor(patient.gender)}`}
              >
                <AvatarFallback
                  className={`text-xs font-medium ${getGenderColor(
                    patient.gender
                  )}`}
                >
                  {getInitials(patient.name)}
                </AvatarFallback>
              </Avatar>
              {/* Patient Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-card-foreground capitalize truncate text-sm">
                    {patient.name}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    ({patient.age ?? "N/A"}
                    {getGenderCode(patient.gender)})
                  </span>
                  {!patient.isActive && (
                    <Badge className="text-xs bg-warning text-warning-foreground">
                      Archived
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="capitalize">{patient.condition}</span>
                  <span>•</span>
                  <span className="font-medium text-primary">
                    ₹{patient.chargePerVisit?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  aria-expanded={showDetails}
                  aria-label={showDetails ? "Hide details" : "Show details"}
                  className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {showDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Details */}
            {showDetails && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {patient.protocol && (
                  <div className="text-xs">
                    <span className="font-medium text-card-foreground">
                      Protocol:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {patient.protocol}
                    </span>
                  </div>
                )}

                {patient.notes && (
                  <div className="text-xs">
                    <span className="font-medium text-card-foreground">
                      Notes:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {expandedNotes ? patient.notes : truncatedNotes}
                    </span>
                    {patient.notes.length > 15 && (
                      <button
                        onClick={() => setExpandedNotes(!expandedNotes)}
                        aria-expanded={expandedNotes}
                        aria-label={
                          expandedNotes ? "Collapse notes" : "Expand notes"
                        }
                        className="ml-1 inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        {expandedNotes ? (
                          <ChevronUp className="h-2 w-2" />
                        ) : (
                          <ChevronDown className="h-2 w-2" />
                        )}
                      </button>
                    )}
                  </div>
                )}
                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCall}
                    disabled={!patient.phone}
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={patient.phone ? "Call patient" : "No phone number"}
                  >
                    <Phone className="h-6 w-6" />
                  </button>

                  <button
                    onClick={handleWhatsAppReminder}
                    disabled={!patient.phone}
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      patient.phone
                        ? "Send WhatsApp reminder"
                        : "No phone number"
                    }
                  >
                    <WhatsAppIcon className="h-6 w-6" />
                  </button>

                  <button
                    onClick={handleNavigate}
                    disabled={!patient.googleMapsLink}
                    className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      patient.googleMapsLink
                        ? "Navigate to patient"
                        : "No location"
                    }
                  >
                    <Navigation className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
                      onClick={() => handleEditPayment(payment)}
                    >
                      <div>
                        <p className="font-medium">
                          {format(new Date(payment.date), "EEEE, dd MMM yyyy")}
                        </p>
                        <p className="text-sm capitalize">
                          {payment.method} • {payment.notes || "No notes"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-medium">
                          ₹{payment.amount.toLocaleString()}
                        </p>
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                  {patientPayments.length === 0 && (
                    <div className="p-8 text-center">
                      <img
                        src="/physio_illustration1.png"
                        alt="No Payments"
                        className="w-20 h-20 mx-auto mb-4 opacity-60"
                      />
                      <p className="text-lg font-medium text-muted-foreground mb-2">
                        No payments recorded yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Track payments when you complete visits
                      </p>
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
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
                      onClick={() => handleEditVisit(visit)}
                    >
                      <div>
                        <p className="font-medium ">
                          {format(new Date(visit.date), "EEEE, dd MMM yyyy")}
                        </p>
                        <p className="text-xs">
                          ₹
                          {visit.charge?.toLocaleString() ||
                            patient?.chargePerVisit?.toLocaleString() ||
                            0}
                        </p>
                        <p className="text-xs">{visit.notes || "No notes"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {visit.completed && (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isPaid
                                ? "bg-success text-success-foreground border border-success"
                                : "bg-warning text-warning-foreground border border-warning"
                            }`}
                          >
                            {isPaid ? "Paid" : "Unpaid"}
                          </span>
                        )}
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  );
                })}
                {patientVisits.length === 0 && (
                  <div className="p-8 text-center">
                    <img
                      src="/physio_illustration1.png"
                      alt="No Visits"
                      className="w-24 h-24 mx-auto mb-4 opacity-60"
                    />
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                      No visits recorded yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start tracking your patient's progress by adding visits
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Media Section */}
        <MediaPreview
          patientId={patient.id}
          patientName={patient.name}
          onViewAll={handleMediaViewAll}
          onUpload={handleMediaUpload}
        />

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

      {/* Edit Visit Modal */}
      <EditVisitModal
        isOpen={isEditVisitModalOpen}
        onClose={() => {
          setIsEditVisitModalOpen(false);
          setSelectedVisit(null);
        }}
        visit={selectedVisit}
        patientName={patient?.name || ""}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        isOpen={isEditPaymentModalOpen}
        onClose={() => {
          setIsEditPaymentModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        patientName={patient?.name || ""}
      />

      {/* Media Upload Modal */}
      {patient && patient.id && patient.name && (
        <MediaUpload
          isOpen={isMediaUploadModalOpen}
          onClose={() => setIsMediaUploadModalOpen(false)}
          patientId={patient.id}
          patientName={patient.name}
          onUploadComplete={handleMediaUploadComplete}
        />
      )}

      {/* Media Gallery Modal */}
      {patient && patient.id && patient.name && (
        <MediaGallery
          isOpen={isMediaGalleryModalOpen}
          patientId={patient.id}
          patientName={patient.name}
          onClose={() => setIsMediaGalleryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientProfile;
