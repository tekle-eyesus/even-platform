import React, { createContext, useContext, useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* --- THE TOAST UI --- */}
      {toast && (
        <div className='fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300'>
          <div
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px]",
              toast.type === "success"
                ? "bg-zinc-900 text-white border-zinc-800"
                : "bg-red-50 text-red-900 border-red-200",
            )}
          >
            {/* Icon */}
            {toast.type === "success" ? (
              <CheckCircle className='w-5 h-5 text-green-400' />
            ) : (
              <AlertCircle className='w-5 h-5 text-red-500' />
            )}

            {/* Message */}
            <p className='text-sm font-medium flex-1'>{toast.message}</p>

            {/* Close Button */}
            <button
              onClick={closeToast}
              className='text-zinc-500 hover:text-white transition-colors'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Custom Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
