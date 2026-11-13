import React from 'react';
import { useController } from 'react-hook-form';
import { DateRangePickerProps } from './types';
import { DateRangePickerBase } from './DateRangePickerBase';

export const DateRangePickerWithController: React.FC<DateRangePickerProps> = (props) => {
    const { field, fieldState } = useController({
        name: props.name,
        control: props.control,
    });

    const handleChange = (range: { from: string; to: string }) => {
        field.onChange(range);
        if (props.onChange) {
            props.onChange(range);
        }
    };

    return (
        <DateRangePickerBase
            {...props}
            fromValue={field.value?.from || props.fromValue || ''}
            toValue={field.value?.to || props.toValue || ''}
            onChange={handleChange}
            error={props.error || fieldState.error?.message}
        />
    );
};
