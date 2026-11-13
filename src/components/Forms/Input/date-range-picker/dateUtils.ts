import { parse, isValid, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isAfter, isBefore, isEqual } from 'date-fns';

export const parseDateValue = (val?: string): Date | null => {
    if (!val) return null;
    try {
        if (typeof val === 'string' && val.includes('-')) {
            const parsed = parse(val.slice(0, 10), 'yyyy-MM-dd', new Date());
            if (isValid(parsed)) return parsed;
        }
        const parsed = new Date(val);
        if (isValid(parsed) && !isNaN(parsed.getTime())) return parsed;
    } catch {
        return null;
    }
    return null;
};

export const generateCalendarDays = (currentMonth: Date): (Date | null)[] => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    const firstDayOfMonth = getDay(start);
    const emptyDays = Array(firstDayOfMonth).fill(null);

    return [...emptyDays, ...days];
};

export const checkDateInRange = (date: Date, selectedFrom: Date | null, selectedTo: Date | null): boolean => {
    if (!selectedFrom || !selectedTo) return false;
    return (
        (isAfter(date, selectedFrom) || isEqual(date, selectedFrom)) &&
        (isBefore(date, selectedTo) || isEqual(date, selectedTo))
    );
};
