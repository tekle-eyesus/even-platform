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
              "flex items-center gap-4 px-5 py-3.5 rounded-xl shadow-xl border backdrop-blur-md min-w-[320px] max-w-[420px]",
              toast.type === "success"
                ? "bg-zinc-900/95 text-zinc-100 border-zinc-800 shadow-zinc-900/20"
                : "bg-red-50/95 text-red-900 border-red-100 shadow-red-500/10",
            )}
          >
            {/* Icon Wrapper */}
            <div
              className={clsx(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                toast.type === "success" ? "bg-green-500/10" : "bg-red-500/10",
              )}
            >
              {toast.type === "success" ? (
                <CheckCircle
                  className='w-4 h-4 text-green-400'
                  strokeWidth={2.5}
                />
              ) : (
                <AlertCircle
                  className='w-4 h-4 text-red-500'
                  strokeWidth={2.5}
                />
              )}
            </div>

            {/* Message */}
            <div className='flex-1 py-0.5'>
              <p className='text-sm font-medium leading-tight'>
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={closeToast}
              className={clsx(
                "p-1 rounded-md transition-colors -mr-1 flex-shrink-0",
                toast.type === "success"
                  ? "text-zinc-500 hover:text-white hover:bg-zinc-800"
                  : "text-red-400 hover:text-red-700 hover:bg-red-100",
              )}
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
