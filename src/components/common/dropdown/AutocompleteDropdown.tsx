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
}

export function AutocompleteDropdown({
  title,
  placeholder,
  options,
  value,
  onValueChange,
  onOptionSelect,
  disabled = false,
  className = ''
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
  }, [inputValue]);

  // Sync external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);


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
    
    // Clear selected option when user starts typing
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

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="w-full flex flex-row justify-start">
        <h3 className="font-semibold text-white text-nowrap underline decoration-cyan-400 mb-2">{title}</h3>
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
          className="border border-2 rounded-md p-2 w-full border-cyan-400/60 focus:border-violet-800/60 bg-gray-600/50 text-white"
        />
        
        {/* Clear Button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
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

      {/* No results message */}
      {isOpen && inputValue !== selectedOption?.name && filteredOptions.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-indigo-500/30 rounded-lg shadow-lg p-4">
          <div className="text-center text-indigo-200">
            <div className="font-medium mb-1">No {title} found..</div>
            <div className="text-sm text-indigo-300/70">
              New {title}? (<span className="text-indigo-300">{inputValue}</span>)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}