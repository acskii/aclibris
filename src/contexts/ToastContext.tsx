import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import ErrorToast from "../components/common/toast/ErrorToast";
import SuccessToast from "../components/common/toast/SuccessToast";

type ToastType = 'error' | 'success'; 

interface Toast {
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void; 
    clearToast: () => void; 
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<Toast | null>();

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message: message, type: type });
    }, []);

    const clearToast = useCallback(() => {
        setToast(null);
    }, []);

    // Handle automatic timeout for success messages
    useEffect(() => {
        if (toast && toast.type === 'success') {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <ToastContext.Provider value={{ showToast, clearToast }}>
            <>
                {toast && toast.type === 'error' && <ErrorToast message={toast.message} onClose={clearToast} />}
                {toast && toast.type === 'success' && <SuccessToast message={toast.message} />}
                {children}
            </>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("[debug:error] => useToast must be used within ToastProvider");
    return context;
};
