import { useEffect, useRef, useState, useMemo } from "react";
import { X, Search, Plus } from "lucide-react";

interface TagDialogProps {
    isOpen: boolean;
    onClose: () => void;
    availableTags: string[];
    selectedTags: string[];                     // array of tag names
    onSelectTag: (tagName: string) => void;
    onCreateTag?: (tagName: string) => void;
    onRemoveTag: (tagName: string) => void;
    onClearAll: () => void;
}

export default function TagDialog({
    isOpen,
    onClose,
    availableTags,
    selectedTags,
    onSelectTag,
    onCreateTag,
    onRemoveTag,
    onClearAll
}: TagDialogProps) {
    if (!isOpen) return null;

    const boundaryRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [create, setCreate] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (boundaryRef.current && !boundaryRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Reset search on close/open
    useEffect(() => {
        setSearchQuery("");
    }, [isOpen]);

    // Filter tags based on search query
    const filteredTags = useMemo(() => {
        return availableTags.filter((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [availableTags, searchQuery]);

    const handleTagToggle = (tagName: string) => {
        if (selectedTags.includes(tagName)) {
            onRemoveTag(tagName);
        } else {
            onSelectTag(tagName);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-stop-3 border border-stop-3 rounded-md p-6 max-w-lg w-full mx-auto" ref={boundaryRef}>
                <div className="flex flex-col gap-4 justify-center">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Filter by Tags</h3>
                    </div>

                    {/* Search input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
                        <input
                            type="text"
                            placeholder="Search tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-md text-white text-sm placeholder-white/30 focus:border-stop-1 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Main Tags List */}
                    <div className="bg-gray-800/40 border border-white/5 rounded-md p-3 overflow-y-auto max-h-48 min-h-[120px] no-scrollbar">
                        {filteredTags.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {filteredTags.map((tag, index) => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={`t-${index}`}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-stop-1 border-stop-1 text-white shadow-sm"
                                                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-white/30 text-sm py-8">
                                No tags found
                            </div>
                        )}
                    </div>

                    {onCreateTag && (
                        <>
                            <h3 className="text-lg text-center font-bold text-white/60">OR</h3>

                            <div className="flex flex-col gap-4">
                                <h3 className="text-lg font-bold text-white">Create New Tag</h3>

                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        placeholder="Enter New Tag"
                                        value={create}
                                        onChange={(e) => setCreate(e.target.value)}
                                        className="w-full py-1 px-2 bg-app-card border border-1 border-white/40 rounded-md text-white font-semibold placeholder-white/50 focus:border-3 focus:outline-none text-base"
                                    />
                    
                                    <button
                                        onClick={() => onCreateTag(create)}
                                        disabled={!create.trim()}
                                        className="cursor-pointer bg-sky-400 hover:bg-sky-600 disabled:bg-orange-600 disabled:cursor-not-allowed text-white px-2 py-2 rounded-md transition-colors flex items-center"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {/* Bottom Selected Tray */}
                    {selectedTags.length > 0 && (
                        <div className="border-t border-white/5 pt-3">
                            <div className="text-xs text-white/50 mb-2 font-medium">
                                Selected Tags ({selectedTags.length})
                            </div>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-0.5">
                                {selectedTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-white/10 text-white font-semibold px-2 py-0.5 rounded text-xs flex items-center gap-1.5 border border-white/5"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            onClick={() => onRemoveTag(tag)}
                                            className="text-white/40 hover:text-white transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClearAll}
                        className="py-1 cursor-pointer text-white hover:text-white/60 font-semibold transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
}