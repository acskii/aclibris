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
            <div className="bg-indigo-800 border border-indigo-800/30 rounded-md p-6 max-w-md w-full mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                
                <p className="text-indigo-200 mb-4">{message}</p>
                
                {warning && (
                    <div className="bg-red-900/60 border border-red-500/30 rounded-md p-3 mb-4">
                        <p className="text-red-300 text-sm">{warning}</p>
                    </div>
                )}
                
                <div className="flex gap-3 justify-end">
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
                        <Trash2 size={16} />
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}