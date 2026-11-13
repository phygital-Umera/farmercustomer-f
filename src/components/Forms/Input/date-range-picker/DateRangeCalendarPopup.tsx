import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { DateRangeCalendarGrid } from './DateRangeCalendarGrid';

interface DateRangeCalendarPopupProps {
    isOpen: boolean;
    portalRef: React.RefObject<HTMLDivElement>;
    popupStyle: React.CSSProperties;
    fromLabel: string;
    toLabel: string;
    selectingFrom: boolean;
    selectedFrom: Date | null;
    selectedTo: Date | null;
    currentMonth: Date;
    calendarDays: (Date | null)[];
    isDateInRange: (date: Date) => boolean;
    onDateSelect: (date: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onGoToToday: () => void;
    onSelectLastDays: (days: number) => void;
    onClearRange: () => void;
}

export const DateRangeCalendarPopup: React.FC<DateRangeCalendarPopupProps> = ({
    isOpen,
    portalRef,
    popupStyle,
    fromLabel,
    toLabel,
    selectingFrom,
    selectedFrom,
    selectedTo,
    currentMonth,
    calendarDays,
    isDateInRange,
    onDateSelect,
    onPrevMonth,
    onNextMonth,
    onGoToToday,
    onSelectLastDays,
    onClearRange,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            ref={portalRef}
            style={popupStyle}
            className="rounded-lg border border-stroke bg-white p-3 shadow-2xl dark:border-strokedark dark:bg-boxdark"
        >
            {/* Selection Mode Indicator */}
            <div className="mb-3 flex items-center justify-between border-b border-stroke pb-2 dark:border-strokedark">
                <div className="flex gap-2 text-xs">
                    <span className={`font-medium ${selectingFrom ? 'text-primary-navy' : 'text-slate-400'}`}>
                        {fromLabel}
                    </span>
                    <span className="text-slate-400">→</span>
                    <span className={`font-medium ${!selectingFrom ? 'text-primary-navy' : 'text-slate-400'}`}>
                        {toLabel}
                    </span>
                </div>
                <div className="flex gap-2 text-xs">
                    {selectedFrom && (
                        <span className="text-green-600">✓ From: {format(selectedFrom, 'dd/MM')}</span>
                    )}
                    {selectedTo && (
                        <span className="text-blue-600">✓ To: {format(selectedTo, 'dd/MM')}</span>
                    )}
                </div>
            </div>

            {/* Calendar Header */}
            <div className="mb-2 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onPrevMonth}
                    className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button
                        type="button"
                        onClick={onGoToToday}
                        className="rounded px-1.5 py-0.5 text-xs text-primary-navy hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        Today
                    </button>
                </div>
                <button
                    type="button"
                    onClick={onNextMonth}
                    className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* Calendar Grid */}
            <DateRangeCalendarGrid
                calendarDays={calendarDays}
                currentMonth={currentMonth}
                selectedFrom={selectedFrom}
                selectedTo={selectedTo}
                isDateInRange={isDateInRange}
                onDateSelect={onDateSelect}
            />

            {/* Quick Actions */}
            <div className="mt-2 flex justify-between border-t border-stroke pt-2 dark:border-strokedark">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onSelectLastDays(7)}
                        className="text-xs text-primary-navy hover:underline"
                    >
                        Last 7 days
                    </button>
                    <button
                        type="button"
                        onClick={() => onSelectLastDays(30)}
                        className="text-xs text-primary-navy hover:underline"
                    >
                        Last 30 days
                    </button>
                </div>
                <button
                    type="button"
                    onClick={onClearRange}
                    className="text-xs text-red-500 hover:underline"
                >
                    Clear
                </button>
            </div>
        </div>,
        document.body
    );
};
