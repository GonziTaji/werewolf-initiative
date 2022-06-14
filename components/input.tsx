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

    let className = 'border border-black rounded-sm px-2';
    if (props.className) {
        className += ' ' + props.className;
    }

    return (
        <div>
            <input {...props} className={className} checked={checked} />
            <br />
            <small className="text-red-700">
                {showError && (errorMsg || 'Valor inválido')}
            </small>
        </div>
    );
}
