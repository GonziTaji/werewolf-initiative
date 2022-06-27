import Input from '../Input';

interface NumberOfParticipantsFormProps {
    participantsCount: number;
    setParticipantsCount: (state: number) => void;
}

export default function NumberOfParticipantsForm({
    participantsCount,
    setParticipantsCount,
}: NumberOfParticipantsFormProps) {
    const minus = () => setParticipantsCount(participantsCount - 1);
    const plus = () => setParticipantsCount(participantsCount + 1);

    return (
        <div className="flex items-stretch">
            <h1 className="grow text-lg">Ingreso de turnos</h1>

            <MinusButton onClick={minus} disabled={participantsCount === 1} />

            <Input
                className="w-12 text-center rounded-none"
                type="number"
                min="1"
                value={participantsCount}
                onInput={(ev) =>
                    setParticipantsCount(parseInt(ev.currentTarget.value))
                }
            />

            <PlusButton onClick={plus} />
        </div>
    );
}

function MinusButton({ className = '', ...props }: ControlButtonProps) {
    className += ' border-r-0';
    return (
        <ControlButton className={className} {...props}>
            -
        </ControlButton>
    );
}

function PlusButton({ className = '', ...props }: ControlButtonProps) {
    className += ' border-l-0';
    return (
        <ControlButton className={className} {...props}>
            +
        </ControlButton>
    );
}

interface ControlButtonProps
    extends React.HTMLAttributes<HTMLButtonElement>,
        React.ButtonHTMLAttributes<HTMLButtonElement> {}

function ControlButton({
    className = '',
    onClick = () => {},
    children,
    ...props
}: ControlButtonProps) {
    return (
        <button
            {...props}
            className={
                className +
                `
                cursor-pointer
                disabled:cursor-not-allowed
                w-8
                border border-black
                font-bold
                bg-slate-300
                text-slate-600
                `
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
}
