// src/components/common/SolverSelector.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SolverOption } from '../../types';

interface SolverSelectorProps {
  options: SolverOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function SolverSelector({ options, selectedId, onSelect, disabled }: SolverSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
          ${disabled
            ? 'bg-nexprime-darker border-nexprime-blue/20 text-white/40 cursor-not-allowed'
            : 'bg-nexprime-dark border-nexprime-blue/30 text-white hover:border-nexprime-cyan'
          }
        `}
      >
        <span className="text-sm font-medium">Solver:</span>
        <span className="text-nexprime-cyan">{selectedOption?.name || 'Select'}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-nexprime-darker border border-nexprime-blue/30 rounded-lg shadow-xl z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left hover:bg-nexprime-blue/10 transition-colors
                ${option.id === selectedId ? 'bg-nexprime-blue/20' : ''}
              `}
            >
              <div className="text-white font-medium">{option.name}</div>
              <div className="text-white/50 text-xs mt-0.5">{option.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
