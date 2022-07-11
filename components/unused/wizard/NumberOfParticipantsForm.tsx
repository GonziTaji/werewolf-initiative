import Input from '../../Input';
import { FaPlus, FaMinus } from 'react-icons/fa';

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
        <div className="text-center">
            <h1 className="pb-16 text-3xl max-w-md mx-auto">
                Ingrese el numero de participantes
            </h1>

            <div className="flex justify-center mx-auto w-fit rounded-lg border border-black shadow-md">
                <MinusButton
                    onClick={minus}
                    disabled={participantsCount === 1}
                />

                <input
                    className="text-3xl w-24 text-center border-none"
                    min="1"
                    value={participantsCount}
                    onInput={(ev) =>
                        setParticipantsCount(parseInt(ev.currentTarget.value))
                    }
                />

                <PlusButton onClick={plus} />
            </div>

            <h2 className="pt-5 text-2xl">Participantes</h2>
        </div>
    );
}

function MinusButton({ className = '', ...props }: ControlButtonProps) {
    return (
        <ControlButton className={'group ' + className} {...props}>
            <FaMinus className="h-6 text-inherit" />
        </ControlButton>
    );
}

function PlusButton({ className = '', ...props }: ControlButtonProps) {
    return (
        <ControlButton className={'group ' + className} {...props}>
            <FaPlus className="h-6 text-inherit " />
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
                text-black disabled:text-gray-500
                cursor-pointer
                disabled:cursor-not-allowed
                font-bold
                text-5xl
                `
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
}
