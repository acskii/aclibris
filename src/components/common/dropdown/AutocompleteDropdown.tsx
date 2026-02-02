import { useState, useEffect, useRef } from 'react';
import { Ban } from 'lucide-react';

export type DropdownOption = {
  id: number;
  name: string;
}

type AutocompleteDropdownProps = {
  title: string;
  placeholder: string;
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  onOptionSelect: (option: DropdownOption | null) => void;
  disabled?: boolean;
  className?: string;
  isUp?: boolean;
}

export function AutocompleteDropdown({
  title,
  placeholder,
  options,
  value,
  onValueChange,
  onOptionSelect,
  disabled = false,
  className = '',
  isUp = false
}: AutocompleteDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
  const [inputValue, setInputValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update filtered options based on input
  useEffect(() => {
    if (inputValue == '') {
      setFilteredOptions(options);
    } else {
      if (inputValue == selectedOption?.name) {
        setFilteredOptions([]);
      } else {
        const filtered = options.filter(option =>
          option.name.toLowerCase().startsWith(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
      }
    }
  }, [inputValue, options, selectedOption]);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue);
    setIsOpen(true);
    
    if (selectedOption && newValue !== selectedOption.name) {
      setSelectedOption(null);
      onOptionSelect(null);
    }
  };

  const handleOptionSelect = (option: DropdownOption) => {
    setInputValue(option.name);
    setSelectedOption(option);
    onValueChange(option.name);
    onOptionSelect(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredOptions.length > 0 && isOpen) {
      handleOptionSelect(filteredOptions[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSelection = () => {
    setInputValue('');
    setSelectedOption(null);
    onValueChange('');
    onOptionSelect(null);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Helper to determine menu positioning classes
  const menuPositionClasses = isUp 
    ? "bottom-full mb-1 rounded-t-md" 
    : "top-full mt-1 rounded-b-md";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="w-full flex flex-row justify-start">
        <h3 className="font-semibold text-white text-nowrap underline decoration-stop-3 mb-2">{title}</h3>
      </div>
      
      {/* Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="border border-2 rounded-md p-2 w-full border-stop-2/60 focus:border-stop-2/60 bg-gray-600/50 text-white"
        />
        
        {/* Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
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

      {/* Dropdown Menu (Results) */}
      {isOpen && filteredOptions.length > 0 && (
        <div className={`absolute z-10 w-full bg-gray-800/95 border border-indigo-500/30 max-h-60 overflow-y-auto ${menuPositionClasses}`}>
          <div className="py-2">
            {filteredOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-4 py-2 hover:bg-stop-3/30 transition-colors`}
              >
                <div className="font-medium text-white">{option.name}</div>
                <hr className="border-gray-700/50" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && inputValue !== selectedOption?.name && filteredOptions.length === 0 && (
        <div className={`absolute z-10 w-full bg-gray-800/95 backdrop-blur-sm border border-indigo-500/30 shadow-lg p-4 ${menuPositionClasses}`}>
          <div className="text-center text-white">
            <div className="font-medium mb-1">No {title} found..</div>
            <div className="text-sm text-white/70">
              New {title}? (<span className="text-white/80">{inputValue}</span>)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}