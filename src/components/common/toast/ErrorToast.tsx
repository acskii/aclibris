/*
    Notification component to notify user for error
*/

import { TriangleAlert, X } from "lucide-react";

interface ErrorToastProps {
    message: string;
    onClose?: () => void;
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
    return (
        <div
            className={`bg-yellow-300 p-4 z-50 rounded-md border border-3 border-red-600 ${onClose ? "flex gap-4 justify-between items-center" : ""}`}
            role="alert"
            aria-labelledby="toast-error"
        >
            <div className="flex gap-4 items-center">
                <div className="text-red-600">
                    <TriangleAlert size={30} />
                </div>
                <p className="text-md text-red-700 font-bold ">{message}</p>
            </div>

            {onClose && (
                <button 
                    onClick={onClose} 
                    className="cursor-pointer"
                >
                    <X className="text-red-600" size={20} />
                </button>
            )}
        </div>
    );
}
