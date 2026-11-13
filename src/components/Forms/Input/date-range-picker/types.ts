import { Control } from 'react-hook-form';

export interface DateRangePickerProps {
    name: string;
    fromValue?: string;
    toValue?: string;
    onChange?: (range: { from: string; to: string }) => void;
    control?: Control<any>;
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    error?: string;
    fromLabel?: string;
    toLabel?: string;
}
