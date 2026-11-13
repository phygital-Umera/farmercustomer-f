import React, { useState, useRef, useEffect, useMemo } from 'react';
import { format, isBefore, addMonths, subMonths } from 'date-fns';
import { parseDateValue, generateCalendarDays, checkDateInRange } from './dateUtils';

interface UseDateRangePickerProps {
    fromValue?: string;
    toValue?: string;
    onChange?: (range: { from: string; to: string }) => void;
}

export const useDateRangePicker = ({
    fromValue = '',
    toValue = '',
    onChange,
}: UseDateRangePickerProps) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFrom, setSelectedFrom] = useState<Date | null>(null);
    const [selectedTo, setSelectedTo] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
    const [selectingFrom, setSelectingFrom] = useState(true);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    // Format display value when dates change
    useEffect(() => {
        if (fromValue && toValue) {
            const from = parseDateValue(fromValue);
            const to = parseDateValue(toValue);

            if (from && to) {
                setDisplayValue(`${format(from, 'dd/MM/yyyy')} - ${format(to, 'dd/MM/yyyy')}`);
                setSelectedFrom(from);
                setSelectedTo(to);
                setCurrentMonth(from);
            } else {
                setDisplayValue('');
            }
        } else if (fromValue) {
            const from = parseDateValue(fromValue);
            if (from) {
                setDisplayValue(`${format(from, 'dd/MM/yyyy')} - ...`);
                setSelectedFrom(from);
                setCurrentMonth(from);
            } else {
                setDisplayValue('');
            }
        } else {
            setDisplayValue('');
            setSelectedFrom(null);
            setSelectedTo(null);
        }
    }, [fromValue, toValue]);

    // Update popup position when opened or resized/scrolled
    const updatePosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            const popupHeight = 360;
            const popupWidth = 320;
            const spaceBelow = window.innerHeight - rect.bottom;
            const showAbove = spaceBelow < popupHeight && rect.top > popupHeight;

            let left = rect.left;
            if (left + popupWidth > window.innerWidth - 10) {
                left = window.innerWidth - popupWidth - 10;
            }
            if (left < 10) left = 10;

            setPopupStyle({
                position: 'fixed',
                top: showAbove ? `${rect.top - popupHeight - 4}px` : `${rect.bottom + 4}px`,
                left: `${left}px`,
                width: `${popupWidth}px`,
                zIndex: 99999,
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen]);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isInsideWrapper = wrapperRef.current?.contains(event.target as Node);
            const isInsidePortal = portalRef.current?.contains(event.target as Node);

            if (!isInsideWrapper && !isInsidePortal) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = (date: Date) => {
        if (selectingFrom) {
            setSelectedFrom(date);
            setSelectingFrom(false);
            if (selectedTo && isBefore(selectedTo, date)) {
                setSelectedTo(null);
            }
        } else {
            if (selectedFrom && isBefore(date, selectedFrom)) {
                setSelectedFrom(date);
                setSelectedTo(selectedFrom);
            } else {
                setSelectedTo(date);
                setSelectingFrom(true);
                if (selectedFrom && date) {
                    const fromStr = format(selectedFrom, 'yyyy-MM-dd');
                    const toStr = format(date, 'yyyy-MM-dd');
                    setDisplayValue(`${format(selectedFrom, 'dd/MM/yyyy')} - ${format(date, 'dd/MM/yyyy')}`);
                    if (onChange) {
                        onChange({ from: fromStr, to: toStr });
                    }
                    setTimeout(() => setIsOpen(false), 300);
                }
            }
        }
    };

    const handleInputClick = () => {
        setIsOpen(true);
        if (selectedFrom) {
            setSelectingFrom(false);
        } else {
            setSelectingFrom(true);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsOpen(true);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const toggleCalendar = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        setIsOpen((prev) => !prev);
    };

    const goToPreviousMonth = () => {
        setCurrentMonth((prev) => subMonths(prev, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => addMonths(prev, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const calendarDays = useMemo(() => generateCalendarDays(currentMonth), [currentMonth]);

    const isDateInRange = (date: Date) => checkDateInRange(date, selectedFrom, selectedTo);

    const handleSelectLastDays = (daysCount: number) => {
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - daysCount);
        setSelectedFrom(pastDate);
        setSelectedTo(today);
        setSelectingFrom(true);
        const fromStr = format(pastDate, 'yyyy-MM-dd');
        const toStr = format(today, 'yyyy-MM-dd');
        setDisplayValue(`${format(pastDate, 'dd/MM/yyyy')} - ${format(today, 'dd/MM/yyyy')}`);
        if (onChange) {
            onChange({ from: fromStr, to: toStr });
        }
        setTimeout(() => setIsOpen(false), 300);
    };

    const clearRange = () => {
        setSelectedFrom(null);
        setSelectedTo(null);
        setDisplayValue('');
        setSelectingFrom(true);
        if (onChange) {
            onChange({ from: '', to: '' });
        }
        setIsOpen(false);
    };

    return {
        displayValue,
        isOpen,
        selectedFrom,
        selectedTo,
        currentMonth,
        popupStyle,
        selectingFrom,
        wrapperRef,
        inputRef,
        portalRef,
        calendarDays,
        isDateInRange,
        handleDateSelect,
        handleInputClick,
        handleInputKeyDown,
        toggleCalendar,
        goToPreviousMonth,
        goToNextMonth,
        goToToday,
        handleSelectLastDays,
        clearRange,
    };
};
