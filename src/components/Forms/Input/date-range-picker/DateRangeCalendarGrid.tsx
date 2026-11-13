import React from 'react';
import { format, isSameDay, isSameMonth, isToday, isBefore } from 'date-fns';

interface DateRangeCalendarGridProps {
    calendarDays: (Date | null)[];
    currentMonth: Date;
    selectedFrom: Date | null;
    selectedTo: Date | null;
    isDateInRange: (date: Date) => boolean;
    onDateSelect: (date: Date) => void;
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MIN_DATE = new Date(2000, 0, 1);

export const DateRangeCalendarGrid: React.FC<DateRangeCalendarGridProps> = ({
    calendarDays,
    currentMonth,
    selectedFrom,
    selectedTo,
    isDateInRange,
    onDateSelect,
}) => {
    return (
        <>
            {/* Day Headers */}
            <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-xs font-medium text-slate-500">
                {DAY_LABELS.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 text-center">
                {calendarDays.map((day, index) => {
                    if (day === null) {
                        return <div key={`empty-${index}`} className="py-1.5" />;
                    }

                    const isSelected =
                        (selectedFrom && isSameDay(day, selectedFrom)) ||
                        (selectedTo && isSameDay(day, selectedTo));
                    const isInRange = isDateInRange(day) && !isSelected;
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isTodayDate = isToday(day);
                    const isDisabled = isBefore(day, MIN_DATE);

                    let bgColor = '';
                    if (isSelected) {
                        bgColor = 'bg-primary-navy text-white hover:bg-primary-navy/90';
                    } else if (isInRange) {
                        bgColor = 'bg-primary-navy/20 text-primary-navy hover:bg-primary-navy/30';
                    } else if (isTodayDate) {
                        bgColor = 'bg-orange-100 text-primary-navy hover:bg-orange-200 dark:bg-orange-900/30';
                    } else if (isCurrentMonth) {
                        bgColor = 'hover:bg-slate-100 dark:hover:bg-slate-700';
                    } else {
                        bgColor = 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700';
                    }

                    return (
                        <button
                            key={day.toString()}
                            type="button"
                            onClick={() => onDateSelect(day)}
                            disabled={isDisabled}
                            className={`rounded py-1.5 text-sm transition-colors ${bgColor} ${
                                isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </>
    );
};
