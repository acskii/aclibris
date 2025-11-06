import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AutocompleteDropdown, DropdownOption } from '../common/dropdown/AutocompleteDropdown';
import { TagObject } from '../../../electron/database/objects/Tag';

interface TagManagerProps {
  currentTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

// Predefined colors that work well with white text
const TAG_COLORS = [
  'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-pink-600',
  'bg-indigo-600', 'bg-teal-600', 'bg-orange-600', 'bg-cyan-600',
  'bg-rose-600', 'bg-violet-600', 'bg-amber-600', 'bg-emerald-600'
];

export function TagManager({ currentTags, onTagsChange, className = '' }: TagManagerProps) {
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState<TagObject[]>([]);
  const [availableTagOptions, setAvailableTagOptions] = useState<DropdownOption[]>([]);

    // Convert allTags to dropdown options
    useEffect(() => {
        const getAllTags = async () => {
            //@ts-ignore
            const response: TagObject[] = await window.db.tag.getAll();
            setAllTags(response);
            setAvailableTagOptions(response);
        }
        getAllTags();
    }, []);

    // Get a consistent color for a tag based on its name
    const getTagColor = (tagName: string): string => {
        const index = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return TAG_COLORS[index % TAG_COLORS.length];
    };

    const addTag = (tagName: string) => {
        const cleanTag = tagName.trim().toLowerCase();
        if (cleanTag && !currentTags.includes(cleanTag)) {
        const newTags = [...currentTags, cleanTag];
        onTagsChange(newTags);
        }
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = currentTags.filter(tag => tag !== tagToRemove);
        onTagsChange(newTags);
    };

    const handleTagSelect = (option: DropdownOption | null) => {
        if (option) {
        addTag(option.name);
        }
    };

    const filteredTagOptions = availableTagOptions.filter(option => 
        !currentTags.includes(option.name) && 
        option.name.toLowerCase().includes(tagInput.toLowerCase())
    );

    return (
        <div className={`mt-6 ${className}`}>
        {/* Current Tags Display */}
        <div className="mb-6">
            <label className="font-semibold text-white text-nowrap underline decoration-cyan-400 mb-3 block">Current Tags</label>
            <div className="flex flex-wrap gap-2 min-h-10">
            {currentTags.map(tag => (
                <span
                key={tag}
                className={`${getTagColor(tag)} text-white font-semibold px-2 rounded-md text-sm flex items-center gap-2 transition-all hover:scale-105`}
                >
                <span>{tag}</span>
                <button
                    onClick={() => removeTag(tag)}
                    className="transition-colors font-semibold rounded-full hover:bg-black/20 mt-0.5"
                >
                    <X size={14} />
                </button>
                </span>
            ))}
            {currentTags.length === 0 && (
                <span className="text-cyan-300/90 font-semibold text-sm">No tags added yet</span>
            )}
            </div>
        </div>

        {/* Add Tag Section */}
        <div className="space-y-3">
            <div className="flex gap-2 items-center justify-center">
            <div className="flex-1">
                <AutocompleteDropdown
                    title="Tag"
                    placeholder="Type a tag name or select from suggestions..."
                    options={filteredTagOptions}
                    value={tagInput}
                    onValueChange={setTagInput}
                    onOptionSelect={handleTagSelect}
                />
            </div>
            
            <button
                onClick={() => addTag(tagInput)}
                disabled={!tagInput.trim()}
                className="mt-8 cursor-pointer bg-sky-400 hover:bg-sky-600 disabled:bg-orange-600 disabled:cursor-not-allowed text-white px-2 py-2 rounded-md transition-colors flex items-center"
            >
                <Plus size={20} />
            </button>
            </div>

            {/* Quick Add Suggestions */}
            {allTags.length > 0 && (
            <div>
                <label className="block text-indigo-200 text-sm font-medium mb-2">
                Quick Add
                </label>
                <div className="flex flex-wrap gap-2">
                {allTags
                    .filter(tag => !currentTags.includes(tag.name))
                    .slice(0, 10) // Limit to 10 suggestions
                    .map(tag => (
                    <button
                        key={tag.id}
                        onClick={() => addTag(tag.name)}
                        className={`${getTagColor(tag.name)} hover:opacity-90 text-white px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1`}
                    >
                        <Plus size={12} />
                        {tag.name}
                    </button>
                    ))}
                </div>
            </div>
            )}
        </div>
        </div>
    );
}