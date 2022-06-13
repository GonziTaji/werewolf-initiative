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

    return (
        <div>
            <input {...props} checked={checked} />
            <br />
            <small className={props.errorClassName || ''}>
                {showError && (errorMsg || 'Valor inválido')}
            </small>
        </div>
    );
}
