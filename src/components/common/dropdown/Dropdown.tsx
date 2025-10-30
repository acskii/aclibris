import { useState, useEffect, useRef } from 'react';
import { Ban } from 'lucide-react';

export type DropdownOption = {
  id: number;
  name: string;
}

type DropdownProps = {
  title: string;
  placeholder: string;
  value: DropdownOption | null;
  options: DropdownOption[];
  onOptionSelect: (option: DropdownOption | null) => void;
  disabled?: boolean;
  className?: string;
}

export function Dropdown({
  title,
  placeholder,
  value,
  options,
  onOptionSelect,
  disabled = false,
  className = ''
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const [inputValue, setInputValue] = useState<string>(placeholder);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    onOptionSelect(option);
    setInputValue(option.name);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredOptions.length > 0 && isOpen) {
      handleOptionSelect(filteredOptions[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    setSelectedOption(null);
    onOptionSelect(null);
    setInputValue(placeholder);
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="w-full flex flex-row justify-start">
        <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400 mb-2">{title}</h3>
      </div>
      
      {/* Input Container */}
      <div className="relative">
        <input
          type="text"
          value={value ? value.name : inputValue}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
        />
        
        {/* Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {(selectedOption || value) && (
            <button
              onClick={clearSelection}
              className="text-indigo-300/70 hover:text-indigo-200 transition-colors p-1"
              type="button"
            >
              <Ban size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full bg-gray-800/95 backdrop-blur-sm border border-indigo-500/30 rounded-b-md max-h-60 overflow-y-auto">
          <div className="py-2">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-4 py-2 hover:bg-indigo-600/30 transition-colors`}
              >
                <div className="font-medium">{option.name}</div>
                <hr />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}