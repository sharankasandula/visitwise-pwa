import { useState } from "react";

export interface UsePatientModalsReturn {
  // Modal states
  isPaymentModalOpen: boolean;
  isVisitModalOpen: boolean;
  isEditVisitModalOpen: boolean;
  isEditPaymentModalOpen: boolean;
  isMediaUploadModalOpen: boolean;
  isMediaGalleryModalOpen: boolean;

  // Selected items
  selectedVisitDate: Date | null;
  selectedVisit: any;
  selectedPayment: any;

  // Modal handlers
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  openVisitModal: (date?: Date) => void;
  closeVisitModal: () => void;
  openEditVisitModal: (visit: any) => void;
  closeEditVisitModal: () => void;
  openEditPaymentModal: (payment: any) => void;
  closeEditPaymentModal: () => void;
  openMediaUploadModal: () => void;
  closeMediaUploadModal: () => void;
  openMediaGalleryModal: () => void;
  closeMediaGalleryModal: () => void;
}

export const usePatientModals = (): UsePatientModalsReturn => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] = useState(false);
  const [isMediaGalleryModalOpen, setIsMediaGalleryModalOpen] = useState(false);

  const [selectedVisitDate, setSelectedVisitDate] = useState<Date | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  const openVisitModal = (date?: Date) => {
    setSelectedVisitDate(date || null);
    setIsVisitModalOpen(true);
  };
  const closeVisitModal = () => {
    setIsVisitModalOpen(false);
    setSelectedVisitDate(null);
  };

  const openEditVisitModal = (visit: any) => {
    setSelectedVisit(visit);
    setIsEditVisitModalOpen(true);
  };
  const closeEditVisitModal = () => {
    setIsEditVisitModalOpen(false);
    setSelectedVisit(null);
  };

  const openEditPaymentModal = (payment: any) => {
    setSelectedPayment(payment);
    setIsEditPaymentModalOpen(true);
  };
  const closeEditPaymentModal = () => {
    setIsEditPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  const openMediaUploadModal = () => setIsMediaUploadModalOpen(true);
  const closeMediaUploadModal = () => setIsMediaUploadModalOpen(false);

  const openMediaGalleryModal = () => setIsMediaGalleryModalOpen(true);
  const closeMediaGalleryModal = () => setIsMediaGalleryModalOpen(false);

  return {
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
  };
};
