import Input from '../Input';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface ActorsCountFormProps {
    participantsCount: number;
    setParticipantsCount: (state: number) => void;
}

export default function ActorsCountForm({
    participantsCount,
    setParticipantsCount,
}: ActorsCountFormProps) {
    const minus = () => setParticipantsCount(participantsCount - 1);
    const plus = () => setParticipantsCount(participantsCount + 1);

    return (
        <div className="flex justify-center mx-auto w-fit rounded-lg border border-black shadow-md">
            <MinusButton onClick={minus} disabled={participantsCount === 1} />

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
