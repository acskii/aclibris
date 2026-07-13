import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    warning?: string;
}

export default function DeleteDialog ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    warning
}: DeleteDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-stop-3 border border-3 border-stop-3 rounded-md p-6 max-w-lg w-full mx-auto">
                <div className="flex justify-center items-center gap-3 mb-4">
                    <AlertTriangle size={40} className="text-red-400" />
                    <h3 className="text-lg font-bold text-red-400">{title}</h3>
                </div>
                
                <p className="text-white/80 text-center font-semibold mb-4">{message}</p>
                
                {warning && (
                    <div className="bg-red-900/60 border border-2 border-red-500/60 rounded-md p-3">
                        <p className="text-red-300 text-center font-semibold text-sm">{warning}</p>
                    </div>
                )}
                
                <div className="flex gap-3 justify-center mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 cursor-pointer text-white font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 bg-red-600 hover:bg-red-700 cursor-pointer font-semibold text-white rounded-md transition-colors flex items-center gap-2`}
                    >
                        <Trash2 size={20} />
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}