import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { usePatientOperations } from "../../hooks/usePatientOperations";
import { usePatientModals } from "../../hooks/usePatientModals";
import { callPatient, navigateToPatient } from "../../services/patientService";
import { calculateVisitPaymentStatus } from "../../utils/paymentUtils";
import { Patient } from "../../store/slices/patientsSlice";

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use custom hooks for patient operations and modal management
  const {
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
  } = usePatientOperations({ patientId: id || "" });

  const {
    isPaymentModalOpen,
    isVisitModalOpen,
    isEditVisitModalOpen,
    isEditPaymentModalOpen,
    isMediaUploadModalOpen,
    isMediaGalleryModalOpen,
    selectedVisitDate,
    selectedVisit,
    selectedPayment,
    openPaymentModal,
    closePaymentModal,
    openVisitModal,
    closeVisitModal,
    openEditVisitModal,
    closeEditVisitModal,
    openEditPaymentModal,
    closeEditPaymentModal,
    openMediaUploadModal,
    closeMediaUploadModal,
    openMediaGalleryModal,
    closeMediaGalleryModal,
  } = usePatientModals();

  useEffect(() => {
    loadPatientData();
  }, [id]);

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

  // Calculate visit payment status
  const visitPaymentStatus = calculateVisitPaymentStatus(
    completedVisits,
    paymentSummary.totalCollected,
    patient?.chargePerVisit ?? 0
  );

  // Handler functions using the extracted utilities
  const handleCall = () => {
    if (patient?.phone) {
      callPatient(patient.phone);
    }
  };

  const handleNavigate = () => {
    if (patient?.googleMapsLink) {
      navigateToPatient(patient.googleMapsLink);
    }
  };

  const handleAddVisit = (date: Date) => {
    openVisitModal(date);
  };

  const handleEditVisit = (visit: any) => {
    openEditVisitModal(visit);
  };

  const handleEditPayment = (payment: any) => {
    openEditPaymentModal(payment);
  };

  const handleMediaUpload = () => {
    openMediaUploadModal();
  };

  const handleMediaViewAll = () => {
    openMediaGalleryModal();
  };

  const handleMediaUploadComplete = () => {
    // Refresh media data if needed
    // The Redux state will automatically update
  };

  // Type adapter to convert Patient to what PatientInfo expects
  const adaptPatientForInfo = (patient: Patient) => ({
    id: patient.id,
    name: patient.name,
    age: patient.age ?? undefined,
    gender: patient.gender,
    condition: patient.condition,
    chargePerVisit: patient.chargePerVisit,
    protocol: patient.protocol || undefined,
    notes: patient.notes || undefined,
    phone: patient.phone || undefined,
    googleMapsLink: patient.googleMapsLink || undefined,
    isActive: patient.isActive,
  });

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
          patient={adaptPatientForInfo(patient)}
          onCall={handleCall}
          onWhatsApp={handleWhatsAppReminder}
          onNavigate={handleNavigate}
        />

        {/* Payments Section */}
        <PaymentsSection
          totalEarned={paymentSummary.totalEarned}
          totalCollected={paymentSummary.totalCollected}
          totalDue={paymentSummary.totalDue}
          payments={patientPayments}
          patientPhone={patient.phone || undefined}
          onRecordPayment={openPaymentModal}
          onWhatsAppReminder={handleWhatsAppReminder}
          onClearDues={() => {
            openPaymentModal();
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
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        patientId={patient?.id || ""}
        patientName={patient?.name || ""}
      />

      {/* Visit Modal */}
      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={closeVisitModal}
        selectedDate={selectedVisitDate}
        patientId={patient?.id || ""}
        patientName={patient?.name || ""}
        defaultCharge={patient?.chargePerVisit || 0}
      />

      {/* Edit Visit Modal */}
      <EditVisitModal
        isOpen={isEditVisitModalOpen}
        onClose={closeEditVisitModal}
        visit={selectedVisit}
        patientName={patient?.name || ""}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        isOpen={isEditPaymentModalOpen}
        onClose={closeEditPaymentModal}
        payment={selectedPayment}
        patientName={patient?.name || ""}
      />

      {/* Media Upload Modal */}
      {patient && patient.id && patient.name && (
        <MediaUpload
          isOpen={isMediaUploadModalOpen}
          onClose={closeMediaUploadModal}
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
          onClose={closeMediaGalleryModal}
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
