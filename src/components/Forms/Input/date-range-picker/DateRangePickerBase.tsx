import React from 'react';
import { DateRangePickerProps } from './types';
import { useDateRangePicker } from './useDateRangePicker';
import { DateRangeInput } from './DateRangeInput';
import { DateRangeCalendarPopup } from './DateRangeCalendarPopup';

export const DateRangePickerBase: React.FC<DateRangePickerProps> = ({
    name,
    fromValue = '',
    toValue = '',
    onChange,
    label,
    placeholder = 'From - To',
    required = false,
    className = '',
    error,
    fromLabel = 'From',
    toLabel = 'To',
}) => {
    const {
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
    } = useDateRangePicker({ fromValue, toValue, onChange });

    return (
        <div className="relative" ref={wrapperRef}>
            <DateRangeInput
                name={name}
                label={label}
                required={required}
                placeholder={placeholder}
                className={className}
                error={error}
                displayValue={displayValue}
                inputRef={inputRef}
                onClick={handleInputClick}
                onKeyDown={handleInputKeyDown}
                onToggleCalendar={toggleCalendar}
            />

            <DateRangeCalendarPopup
                isOpen={isOpen}
                portalRef={portalRef}
                popupStyle={popupStyle}
                fromLabel={fromLabel}
                toLabel={toLabel}
                selectingFrom={selectingFrom}
                selectedFrom={selectedFrom}
                selectedTo={selectedTo}
                currentMonth={currentMonth}
                calendarDays={calendarDays}
                isDateInRange={isDateInRange}
                onDateSelect={handleDateSelect}
                onPrevMonth={goToPreviousMonth}
                onNextMonth={goToNextMonth}
                onGoToToday={goToToday}
                onSelectLastDays={handleSelectLastDays}
                onClearRange={clearRange}
            />
        </div>
    );
};
