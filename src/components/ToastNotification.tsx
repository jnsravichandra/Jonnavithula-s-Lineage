import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface ToastNotificationProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

function ToastNotification({
  message,
  type,
  duration = 3000,
}: ToastNotificationProps) {
  useEffect(() => {
    switch (type) {
      case "success":
        toast.success(message, { duration });
        break;
      case "error":
        toast.error(message, { duration });
        break;
      default:
        toast(message, { duration });
        break;
    }
  }, [message, type, duration]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default ToastNotification;
