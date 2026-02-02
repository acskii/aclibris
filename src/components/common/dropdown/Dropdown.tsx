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
  isUp?: boolean;
}

export function Dropdown({
  title,
  placeholder,
  value,
  options,
  onOptionSelect,
  disabled = false,
  className = '',
  isUp = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const [inputValue, setInputValue] = useState<string>(placeholder);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value?.name ?? placeholder);
  }, [value, placeholder]);

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
        <h3 className="font-semibold text-white text-nowrap underline decoration-stop-3 mb-2">{title}</h3>
      </div>

      <div className="relative">
        <input
          type="text"
          value={value ? value.name : inputValue}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className="border border-2 rounded-md p-2 w-full border-stop-2/60 focus:border-stop-3/60 bg-gray-600/50 text-white"
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {(selectedOption || value) && (
            <button
              onClick={clearSelection}
              className="text-white/70 hover:text-white transition-colors p-1"
              type="button"
            >
              <Ban size={20} />
            </button>
          )}
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div 
          className={`
            absolute z-10 w-full bg-gray-800/95 border border-stop-3/30 overflow-y-auto max-h-60
            ${isUp ? 'bottom-full mb-1 rounded-t-md' : 'top-full mt-1 rounded-b-md'}
          `}
        >
          <div className="py-2">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left px-4 py-2 hover:bg-stop-3/30 transition-colors"
              >
                <div className="font-medium text-white">{option.name}</div>
                <hr className="border-gray-700 mt-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}