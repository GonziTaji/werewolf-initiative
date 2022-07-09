import { useRouter } from 'next/router';
import { FaCaretRight } from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import { useTurns } from '../hooks/useTurns';

export default function Home() {
    const router = useRouter();

    const { roundIndex, dispatchTurns } = useTurns();
    const menuItemProps: MenuItemProps[] = [
        {
            action: async () => {
                let navigate = true;

                if (roundIndex !== -1) {
                    const message =
                        '¿Está seguro de comenzar un nuevo encuentro?' +
                        '\n\nEsto eliminará toda la información del encuentro actual.';

                    navigate = confirm(message);
                }

                if (navigate) {
                    router
                        .push('/wizard')
                        .then(() => dispatchTurns({ type: 'limpiar' }));
                }
            },
            children: 'Nuevo Encuentro',
        },
        {
            action: () => router.push('/encounter'),
            children: 'Continuar Encuentro',
            disabled: roundIndex === -1,
        },
    ];

    return (
        <div className="">
            <PageHeader title="Menú principal">
                <ul className="">
                    {menuItemProps.map((link, i) => (
                        <MenuItem key={i} {...link} />
                    ))}
                </ul>
            </PageHeader>
            <div className="sticky top-0 shadow-md"></div>

            <div className="px-2 pt-4">
                <h2 className="text-lg">Accesos directos</h2>
                <ul className="list-disc">
                    <li className="bold ">
                        <a href="https://www.wyrmfoe.com/" target="blank">
                            <span className="underline">Wyrmfoe</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

interface MenuItemProps {
    children: any;
    disabled?: boolean;
    action: () => void;
}

const MenuItem = ({ action, children, disabled }: MenuItemProps) => (
    <li className="text-xl cursor-pointer border-b border-black px-2 py-1">
        <button
            className="disabled:text-slate-700/60 "
            onClick={action}
            disabled={disabled}
        >
            <span>
                <FaCaretRight className="inline" />
                {children}
            </span>
        </button>
    </li>
);
