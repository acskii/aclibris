import { useEffect, useRef, useState } from "react";

interface CreateDialogProps {
    isOpen: boolean;
    options: DialogOption[];
    item: string;
    selected: number | null;
    onOptionSelect: (option: DialogOption | null) => void;
    onClose: () => void;
    onCreate: (item: string) => void;
}

export interface DialogOption {
    id: number;
    name: string;
}

export default function CreateDialog({ isOpen, options, item, selected = null, onOptionSelect, onClose, onCreate } : CreateDialogProps) {
    if (!isOpen) return null;
    
    const [choices, setChoices] = useState<DialogOption[]>(options);
    const [create, setCreate] = useState<string>('')
    const boundaryRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        /* Update internal options on external option change */
        setChoices(options);
    }, [options]);

    useEffect(() => {
        /* If user clicks outside the dialog, it closes */
        const handleClickOutside = (event: MouseEvent) => {
            if (boundaryRef.current && !boundaryRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-stop-3 border border-stop-3 rounded-md p-6 max-w-lg w-full mx-auto" ref={boundaryRef}>
                <div className="flex flex-col gap-4 justify-center">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-white">Select {item}</h3>
                        
                        <div className="bg-gray-800/95 border border-stop-3/30 overflow-y-auto max-h-60">
                            <div className="py-2">
                                {choices.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => onOptionSelect(c)}
                                        className={`${selected && selected == c.id ? "bg-stop-3/60" : ""} w-full text-left px-4 py-2 hover:bg-stop-3/30 transition-colors`}
                                    >
                                        <div className="font-medium text-white">{c.name}</div>
                                        <hr className="border-gray-700 mt-1" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg text-center font-bold text-white/60">OR</h3>
                    
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-white">Create New {item}</h3>
                        
                        <div className="flex gap-3 justify-center mt-4">
                            <input
                                type="text"
                                placeholder={`Enter ${item} Name`}
                                value={create}
                                onChange={(e) => setCreate(e.target.value)}
                                className="w-full py-1 px-2 bg-app-card border border-3 border-stop-1 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
                            />
                            <button
                                onClick={() => onCreate(create)}
                                className={`px-4 py-2 bg-stop-2 border border-3 border-stop-1 hover:bg-stop-2/80 cursor-pointer font-semibold text-white rounded-md transition-colors flex items-center gap-2`}
                                disabled={create === ''}
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => onOptionSelect(null)}
                        className="py-1 cursor-pointer text-white hover:text-white/60 font-semibold transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}