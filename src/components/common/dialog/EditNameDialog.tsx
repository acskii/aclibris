import { useState, useEffect } from 'react';
import { Check, PenBox } from 'lucide-react';

interface EditNameDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newName: string) => void;
    title: string;
    currentName?: string;
    placeholder?: string;
    type?: 'shelf' | 'collection' | 'book';
}

export function EditNameDialog({
    isOpen,
    onClose,
    onSave,
    title,
    currentName = "",
    placeholder = "Enter new name..."
}: EditNameDialogProps) {
    const [newName, setNewName] = useState(currentName);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when dialog opens/closes or currentName changes
    useEffect(() => {
        if (isOpen) {
            setNewName(currentName);
        }
    }, [isOpen, currentName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || newName.trim() === currentName) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        onSave(newName.trim());
        onClose();
        setIsSubmitting(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-stop-3 border border-stop-3 rounded-md p-6 max-w-lg w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <PenBox size={40} className="text-stop-1" />
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-indigo-200 text-sm font-medium mb-2">
                            Enter New Name {currentName != "" && <span className="text-white/50">
                                (Current: "{currentName}")
                            </span>}
                        </label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={100}     // Based on schema max length
                            placeholder={placeholder}
                            className="w-full bg-stop-2/50 border border-stop-2/30 rounded-md px-4 py-3 text-white placeholder-stop-2/50 focus:outline-none focus:ring-2 focus:ring-stop-2 focus:border-transparent"
                            autoFocus
                        />
                        <div className="flex justify-between items-center mt-4">
                            
                            <span className={`text-sm font-semibold ${
                                newName.length === 0 ? 'text-red-400' : 
                                newName === currentName ? 'text-stop-1' : 'text-green-400'
                            }`}>
                                {newName.length === 0 ? 'Name cannot be empty' :
                                 newName === currentName ? 'No changes made' :
                                 <Check size={20} />}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 cursor-pointer text-white font-semibold transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!newName.trim() || newName.trim() === currentName || isSubmitting}
                            className="px-4 py-2 font-semibold cursor-pointer bg-stop-1 hover:bg-stop-1/80 disabled:bg-stop-2/50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <PenBox size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}