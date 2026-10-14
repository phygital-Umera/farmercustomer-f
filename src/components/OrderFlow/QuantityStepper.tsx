import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-7 px-2 text-xs gap-1.5',
    md: 'h-8 px-2.5 text-sm gap-2',
    lg: 'h-10 px-3.5 text-base gap-3',
  }[size];

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18,
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-between rounded-lg bg-[#00450d] text-white font-bold shadow-sm select-none transition-all active:scale-95 ${sizeClasses} ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onDecrement}
        className="flex items-center justify-center p-0.5 rounded hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus size={iconSizes} strokeWidth={2.5} />
      </button>

      <span className="font-semibold tracking-tight min-w-[1.25rem] text-center">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        className="flex items-center justify-center p-0.5 rounded hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus size={iconSizes} strokeWidth={2.5} />
      </button>
    </div>
  );
};
