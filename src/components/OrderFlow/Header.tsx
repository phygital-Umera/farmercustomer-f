import React from 'react';
import { Sprout, ChevronDown, User, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenAddress?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddress, onOpenProfile }) => {
  const { address } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-black/[0.04]">
      <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
        <div className="flex flex-col">
          {/* Brand Name */}
          <div className="flex items-center gap-1.5 text-[#00450d]">
            <Sprout size={20} className="stroke-[2.4] text-[#1b5e20]" />
            <span className="font-bold text-lg sm:text-xl tracking-tight leading-none text-[#00450d]">
              Apna Sabzi Mandi
            </span>
          </div>

          {/* Delivery Location pill */}
          <button
            type="button"
            onClick={onOpenAddress}
            className="flex items-center gap-1 text-[12px] sm:text-[13px] text-[#41493e] hover:text-[#00450d] transition-colors mt-0.5 text-left cursor-pointer group"
          >
            <MapPin size={12} className="text-[#1b5e20] shrink-0" />
            <span className="font-medium truncate max-w-[210px] sm:max-w-xs">
              Deliver to: <span className="text-[#1b1c1c] font-semibold">{address.city} {address.pincode}</span> (10-15 mins)
            </span>
            <ChevronDown size={13} className="text-[#41493e] group-hover:translate-y-0.5 transition-transform shrink-0" />
          </button>
        </div>

        {/* Profile Avatar Button */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-[#00450d] text-white flex items-center justify-center hover:bg-[#1b5e20] transition-colors shadow-sm shrink-0 cursor-pointer"
          aria-label="User Profile"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
};
