import React, { useState, useEffect } from "react";
import { CheckCircle, Warning, X, Info } from "@phosphor-icons/react";

const Toast = ({
  message,
  type = "success",
  show,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          bgColor: "bg-green-50 border-green-200",
          iconColor: "text-green-500",
          textColor: "text-green-800",
        };
      case "error":
        return {
          icon: Warning,
          bgColor: "bg-red-50 border-red-200",
          iconColor: "text-red-500",
          textColor: "text-red-800",
        };
      case "warning":
        return {
          icon: Warning,
          bgColor: "bg-yellow-50 border-yellow-200",
          iconColor: "text-yellow-500",
          textColor: "text-yellow-800",
        };
      case "info":
        return {
          icon: Info,
          bgColor: "bg-blue-50 border-blue-200",
          iconColor: "text-blue-500",
          textColor: "text-blue-800",
        };
      default:
        return {
          icon: Info,
          bgColor: "bg-gray-50 border-gray-200",
          iconColor: "text-gray-500",
          textColor: "text-gray-800",
        };
    }
  };

  const { icon: Icon, bgColor, iconColor, textColor } = getToastConfig();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div
        className={`${bgColor} border rounded-lg p-4 shadow-lg transform transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center">
          <Icon size={20} className={`${iconColor} mr-3 flex-shrink-0`} />
          <p className={`${textColor} font-medium flex-1`}>{message}</p>
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hook for using toast
export const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const ToastComponent = () => (
    <Toast
      message={toast.message}
      type={toast.type}
      show={toast.show}
      onClose={hideToast}
    />
  );

  return { showToast, ToastComponent };
};

export default Toast;
