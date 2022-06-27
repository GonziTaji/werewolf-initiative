import { InputHTMLAttributes } from 'react';

interface NewInputProps extends InputHTMLAttributes<HTMLInputElement> {
    errorMsg?: string;
    isValid?: boolean;
    value?: any;
    errorClassName?: string;
}

export default function Input({ isValid, errorMsg, ...props }: NewInputProps) {
    const checked = props.type === 'checkbox' ? props.value : false;
    let showError = isValid === undefined ? false : !isValid;

    let className = 'border rounded-sm px-2';
    if (props.className) {
        className += ' ' + props.className;
    }

    if (showError) {
        className += ' ' + 'border-rose-600';
    } else {
        className += ' ' + 'border-black';
    }

    errorMsg = errorMsg || 'Valor inválido';

    return (
        <input
            {...props}
            title={showError ? errorMsg : ''}
            className={className}
            checked={checked}
        />
    );
}
