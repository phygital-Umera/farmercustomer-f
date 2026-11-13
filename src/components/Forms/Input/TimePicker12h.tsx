import React from 'react';

interface TimePicker12hProps {
  /** 24-hour "HH:mm" string, or "" when nothing is picked yet. */
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ['00', '15', '30', '45'];

const parse = (value: string) => {
  if (!value) return { hour: '', minute: '00', period: 'AM' as const };
  const [h, m] = value.split(':').map(Number);
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return { hour: String(hour12), minute: String(m || 0).padStart(2, '0'), period };
};

const to24h = (hour: string, minute: string, period: 'AM' | 'PM') => {
  let h = Number(hour) % 12;
  if (period === 'PM') h += 12;
  return `${String(h).padStart(2, '0')}:${minute}`;
};

/** Indian-style 12-hour time picker (Hour : Min AM/PM), emitting 24-hour "HH:mm". */
export const TimePicker12h: React.FC<TimePicker12hProps> = ({ value, onChange, className = '' }) => {
  const { hour, minute, period } = parse(value);

  const update = (next: Partial<{ hour: string; minute: string; period: 'AM' | 'PM' }>) => {
    const h = next.hour ?? hour;
    if (!h) return;
    onChange(to24h(h, next.minute ?? minute, next.period ?? period));
  };

  const selectClass = `${className} cursor-pointer appearance-none text-center`;

  return (
    <div className="flex items-center gap-1">
      <select
        aria-label="Hour"
        value={hour}
        onChange={(e) => update({ hour: e.target.value })}
        className={selectClass}
      >
        <option value="" disabled>
          --
        </option>
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-xs font-bold text-[#525e54]">:</span>
      <select
        aria-label="Minute"
        value={minute}
        onChange={(e) => update({ minute: e.target.value })}
        className={selectClass}
      >
        {!MINUTES.includes(minute) && <option value={minute}>{minute}</option>}
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        aria-label="AM or PM"
        value={period}
        onChange={(e) => update({ period: e.target.value as 'AM' | 'PM' })}
        className={selectClass}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};
