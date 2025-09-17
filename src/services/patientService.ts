import { AppDispatch } from "../store";
import {
  setPatientActiveStatus,
  deletePatientAsync,
  Patient,
} from "../store/slices/patientsSlice";

export interface ArchivePatientParams {
  patientId: string;
  isActive: boolean;
  dispatch: AppDispatch;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export interface DeletePatientParams {
  patientId: string;
  patientName: string;
  dispatch: AppDispatch;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Archives or restores a patient
 */
export const archivePatient = async ({
  patientId,
  isActive,
  dispatch,
  onSuccess,
  onError,
}: ArchivePatientParams): Promise<boolean> => {
  try {
    const result = await dispatch(
      setPatientActiveStatus({
        patientId,
        isActive,
      }) as any
    );

    if (result.meta.requestStatus === "fulfilled") {
      const action = isActive ? "activated" : "archived";
      onSuccess?.(`Patient has been ${action} successfully!`);
      return true;
    } else if (result.meta.requestStatus === "rejected") {
      const errorMessage = result.error?.message || "Unknown error";
      onError?.(
        `Failed to ${
          isActive ? "activate" : "archive"
        } patient: ${errorMessage}`
      );
      return false;
    }
    return false;
  } catch (error) {
    console.error(
      `Error ${isActive ? "activating" : "archiving"} patient:`,
      error
    );
    onError?.(
      `Failed to ${
        isActive ? "activate" : "archive"
      } patient. Please try again.`
    );
    return false;
  }
};

/**
 * Deletes a patient permanently
 */
export const deletePatient = async ({
  patientId,
  patientName,
  dispatch,
  onSuccess,
  onError,
}: DeletePatientParams): Promise<boolean> => {
  try {
    await dispatch(deletePatientAsync(patientId) as any);
    onSuccess?.();
    return true;
  } catch (error) {
    console.error("Error deleting patient:", error);
    onError?.("Failed to delete patient. Please try again.");
    return false;
  }
};

/**
 * Initiates a phone call to the patient
 */
export const callPatient = (phone: string): void => {
  if (!phone) {
    alert("Patient phone number is not available");
    return;
  }
  window.open(`tel:${phone}`, "_self");
};

/**
 * Opens Google Maps navigation for the patient's location
 */
export const navigateToPatient = (googleMapsLink: string): void => {
  if (!googleMapsLink) {
    alert("Google Maps link not available");
    return;
  }
  window.open(googleMapsLink, "_blank");
};

/**
 * Confirms deletion with user before proceeding
 */
export const confirmDeletePatient = (
  patientName: string,
  onConfirm: () => void
): void => {
  if (
    window.confirm(
      `Are you sure you want to delete ${patientName}? This action cannot be undone.`
    )
  ) {
    onConfirm();
  }
};
