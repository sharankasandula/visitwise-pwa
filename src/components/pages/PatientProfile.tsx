import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  setPatientActiveStatus,
  fetchPatients,
  deletePatientAsync,
} from "../../store/slices/patientsSlice";
import { fetchVisitsAsync } from "../../store/slices/visitsSlice";
import { fetchPaymentsAsync } from "../../store/slices/paymentsSlice";
import PaymentModal from "../PaymentModal";
import VisitModal from "../VisitModal";
import EditVisitModal from "../EditVisitModal";
import EditPaymentModal from "../EditPaymentModal";
import MediaPreview from "../MediaPreview";
import MediaUpload from "../modals/MediaUpload";
import MediaGallery from "../MediaGallery";
import { FollowUpReminderModal } from "../modals";
import PatientHeader from "../sections/PatientHeader";
import PatientInfo from "../sections/PatientInfo";
import PaymentsSection from "../sections/PaymentsSection";
import VisitsSection from "../sections/VisitsSection";
import RemindersSection from "../sections/RemindersSection";

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
  const [isArchiving, setIsArchiving] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isMediaGalleryModalOpen, setIsMediaGalleryModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

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

    if (patient.isActive) {
      // Show follow-up reminder modal when archiving
      setIsFollowUpModalOpen(true);
    } else {
      // Directly restore when unarchiving
      try {
        setIsArchiving(true);
        const result = await dispatch(
          setPatientActiveStatus({
            patientId: patient.id,
            isActive: true,
          }) as any
        );

        if (result.meta.requestStatus === "fulfilled") {
          alert(`Patient ${patient.name} has been activated successfully!`);
          setPatient((prev) => (prev ? { ...prev, isActive: true } : null));
          navigate("/");
        } else if (result.meta.requestStatus === "rejected") {
          alert(
            `Failed to activate patient: ${
              result.error?.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error activating patient:", error);
        alert("Failed to activate patient. Please try again.");
      } finally {
        setIsArchiving(false);
      }
    }
  };

  const handleFollowUpConfirm = async (days: number) => {
    if (!patient) return;

    try {
      setIsArchiving(true);
      const result = await dispatch(
        setPatientActiveStatus({
          patientId: patient.id,
          isActive: false,
        }) as any
      );

      if (result.meta.requestStatus === "fulfilled") {
        alert(
          `Patient ${patient.name} has been archived with a ${days}-day follow-up reminder!`
        );
        setPatient((prev) => (prev ? { ...prev, isActive: false } : null));
        navigate("/");
      } else if (result.meta.requestStatus === "rejected") {
        alert(
          `Failed to archive patient: ${
            result.error?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error archiving patient:", error);
      alert("Failed to archive patient. Please try again.");
    } finally {
      setIsArchiving(false);
      setIsFollowUpModalOpen(false);
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
    <div className="min-h-screen">
      {/* Header */}
      <PatientHeader
        isArchiving={isArchiving}
        onArchive={handleArchive}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="p-4 space-y-6">
        {/* Patient Info Card */}
        <PatientInfo
          patient={patient}
          onCall={handleCall}
          onWhatsApp={handleWhatsAppReminder}
          onNavigate={handleNavigate}
        />

        {/* Payments Section */}
        <PaymentsSection
          totalEarned={totalEarned}
          totalCollected={totalCollected}
          totalDue={totalDue}
          payments={patientPayments}
          patientPhone={patient.phone}
          onRecordPayment={() => setIsPaymentModalOpen(true)}
          onWhatsAppReminder={handleWhatsAppReminder}
          onClearDues={() => {
            setIsPaymentModalOpen(true);
            setSelectedVisitDate(null);
          }}
          onEditPayment={handleEditPayment}
        />

        {/* Visit History Section */}
        <VisitsSection
          visits={patientVisits}
          patientId={patient.id}
          patientName={patient.name}
          defaultCharge={patient.chargePerVisit}
          visitPaymentStatus={visitPaymentStatus}
          onAddVisit={handleAddVisit}
          onEditVisit={handleEditVisit}
        />

        {/* Media Section */}
        <MediaPreview
          patientId={patient.id}
          patientName={patient.name}
          onViewAll={handleMediaViewAll}
          onUpload={handleMediaUpload}
        />

        {/* Reminders Section */}
        <RemindersSection patient={patient} />
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

      {/* Follow-up Reminder Modal */}
      {patient && (
        <FollowUpReminderModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          onConfirm={handleFollowUpConfirm}
          patientName={patient.name}
        />
      )}
    </div>
  );
};

export default PatientProfile;
