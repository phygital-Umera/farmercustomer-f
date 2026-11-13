import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    DateRangePickerProps,
    DateRangePickerBase,
    DateRangePickerWithController,
} from './date-range-picker';

export type { DateRangePickerProps };

const DateRangePicker: React.FC<DateRangePickerProps> = (props) => {
    const formContext = useFormContext();
    const effectiveControl = props.control || formContext?.control;

    if (effectiveControl && props.name && props.fromValue === undefined && props.toValue === undefined) {
        return <DateRangePickerWithController {...props} control={effectiveControl} />;
    }

    return <DateRangePickerBase {...props} />;
};

export default DateRangePicker;
