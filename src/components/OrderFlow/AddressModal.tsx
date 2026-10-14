import React, { useState } from 'react';
import { X, MapPin, Check, Home, Briefcase, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';


interface AddressModalProps {
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ onClose }) => {
  const { address, setAddress } = useCart();
  const [flat, setFlat] = useState(address.flat);
  const [landmark, setLandmark] = useState(address.landmark);
  const [pincode, setPincode] = useState(address.pincode);
  const [city, setCity] = useState(address.city);
  const [label, setLabel] = useState(address.label);

  const presets = [
    {
      label: 'Ghar Tak / To Home',
      flat: 'Flat 402, Gokul Dham',
      landmark: 'MG Road',
      pincode: '400001',
      city: 'Mumbai',
      icon: <Home size={16} />,
    },
    {
      label: 'Office / Work',
      flat: 'Building B, 5th Floor, Trade Center',
      landmark: 'Bandra Kurla Complex',
      pincode: '400051',
      city: 'Mumbai',
      icon: <Briefcase size={16} />,
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAddress({
      label,
      flat,
      landmark,
      pincode,
      city,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 space-y-4 shadow-xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00450d]">
            <MapPin size={20} />
            <h3 className="font-extrabold text-base sm:text-lg">Delivery Location Badlo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#525e54]">Saved Addresses:</p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => {
              const isMatch = address.flat === p.flat;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setAddress(p);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                    isMatch
                      ? 'border-[#1b5e20] bg-[#e8f5e9] text-[#00450d]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="mt-0.5 text-[#1b5e20] shrink-0">{p.icon}</div>
                  <div className="text-xs min-w-0 flex-1">
                    <p className="font-bold leading-snug truncate">{p.label}</p>
                    <p className="text-[10px] text-[#525e54] truncate">{p.flat}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Edit Form */}
        <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
              Flat / House / Floor No.
            </label>
            <input
              type="text"
              required
              value={flat}
              onChange={(e) => setFlat(e.target.value)}
              className="w-full bg-[#f9fbf9] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20]"
              placeholder="e.g. Flat 402, Gokul Dham"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
              Street / Area / Landmark
            </label>
            <input
              type="text"
              required
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full bg-[#f9fbf9] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20]"
              placeholder="e.g. MG Road, Near Jain Temple"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                Pincode
              </label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-[#f9fbf9] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20]"
                placeholder="400001"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1b1c1c] mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#f9fbf9] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20]"
                placeholder="Mumbai"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00450d] hover:bg-[#1b5e20] text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer mt-2"
          >
            Save &amp; Continue
          </button>
        </form>
      </div>
    </div>
  );
};
