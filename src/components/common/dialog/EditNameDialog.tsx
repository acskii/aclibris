import { useState, useEffect } from 'react';
import { Check, PenBox } from 'lucide-react';

interface EditNameDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newName: string) => void;
    title: string;
    currentName: string;
    placeholder?: string;
    type?: 'shelf' | 'collection' | 'book';
}

export function EditNameDialog({
    isOpen,
    onClose,
    onSave,
    title,
    currentName,
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
        try {
            onSave(newName.trim());
            onClose();
        } catch (error) {
            console.error('Error updating name:', error);
        } finally {
            setIsSubmitting(false);
        }
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
            <div className="bg-indigo-800 border border-indigo-800/30 rounded-md p-6 max-w-md w-full mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <PenBox className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-indigo-200 text-sm font-medium mb-2">
                            New Name <span className="text-indigo-300">
                                (Current: "{currentName}")
                            </span>
                        </label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full bg-violet-600/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                        />
                        <div className="flex justify-between items-center mt-2">
                            
                            <span className={`text-xs ${
                                newName.length === 0 ? 'text-red-400' : 
                                newName === currentName ? 'text-blue-400' : 'text-green-400'
                            }`}>
                                {newName.length === 0 ? 'Name cannot be empty' :
                                 newName === currentName ? 'No changes made' :
                                 <Check size={15} />}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
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
                            className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <PenBox size={16} />
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