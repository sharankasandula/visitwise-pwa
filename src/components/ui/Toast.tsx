import { Toaster } from "sonner";

interface ToastProps {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  richColors?: boolean;
  closeButton?: boolean;
  duration?: number;
}

export function Toast({
  position = "top-right",
  richColors = true,
  closeButton = true,
  duration = 4000,
}: ToastProps) {
  return (
    <Toaster
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      duration={duration}
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  );
}

export default Toast;
