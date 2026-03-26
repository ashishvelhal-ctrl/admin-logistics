import React, { useState, useEffect } from "react";
import { toastService, type Toast } from "@/lib/toast";

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setToasts([...toastService["toasts"]]);

    const listener = (updatedToasts: Toast[]) => {
      setToasts([...updatedToasts]);
    };

    toastService.addListener(listener);

    return () => {
      toastService.removeListener(listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <ToastItem
          key={index}
          toast={toast}
          onClose={() => toastService.removeToast(toast)}
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "info":
      default:
        return "bg-blue-500 text-white border-blue-600";
    }
  };

  return (
    <div
      className={`
        p-4 rounded-lg shadow-lg border min-w-[300px] max-w-md
        transform transition-all duration-300 ease-in-out
        ${getToastStyles(toast.type)}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm mt-1 opacity-90">{toast.message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:opacity-80 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};
