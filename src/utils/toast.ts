import { toast } from "sonner";

// Success notifications
export const showSuccess = (message: string, description?: string) => {
  return toast.success(message, {
    description,
    duration: 4000,
  });
};

// Error notifications
export const showError = (message: string, description?: string) => {
  return toast.error(message, {
    description,
    duration: 6000,
  });
};

// Warning notifications
export const showWarning = (message: string, description?: string) => {
  return toast.warning(message, {
    description,
    duration: 5000,
  });
};

// Info notifications
export const showInfo = (message: string, description?: string) => {
  return toast.info(message, {
    description,
    duration: 4000,
  });
};

// Loading notifications
export const showLoading = (message: string) => {
  return toast.loading(message);
};

// Dismiss a specific toast
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Promise-based success/error handling
export const handlePromise = <T>(
  promise: Promise<T>,
  {
    loading = "Loading...",
    success = "Success!",
    error = "Something went wrong",
  }: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
) => {
  return toast.promise(promise, {
    loading,
    success,
    error,
  });
};

// Custom toast with custom styling
export const showCustom = (
  message: string,
  options?: {
    description?: string;
    duration?: number;
    icon?: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
  }
) => {
  return toast(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    icon: options?.icon,
    action: options?.action,
  });
};
