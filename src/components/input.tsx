type InputValue = string | boolean | number;

interface InputProps {
    value: any;
    setValue: (value: InputValue) => void;
    /** returns the validity  */
    isValid?: (value: InputValue) => boolean;
    errorMessage?: string;
    type?: string;
    className?: string;
    placeholder?: string;
}

export const Input = ({
    value,
    setValue,
    isValid = () => true,
    errorMessage,
    type = 'text',
    className = '',
}: InputProps) => (
    <>
        <input
            className={className}
            type={type}
            value={value}
            onChange={(ev) => setValue(ev.currentTarget.value)}
        />
        <small className="d-block text-danger">
            {!isValid(value) && (errorMessage || 'Valor inválido')}
        </small>
    </>
);
