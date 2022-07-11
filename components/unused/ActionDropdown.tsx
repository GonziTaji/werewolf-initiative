import { useRef, useState } from 'react';
import useEvent from '../../hooks/useEvent';
import { ComponentBaseProps } from '../../interfaces';

interface ActionDropdownProps extends ComponentBaseProps {}

export default function ActionDropdown({
    children,
    className,
}: ActionDropdownProps) {
    const [show, setShow] = useState(false);

    const parentRef = useRef<HTMLDivElement>(null);

    useEvent('click', (ev) => {
        const target: HTMLDivElement = ev.target as any;

        target !== parentRef.current &&
            target.parentNode !== parentRef.current &&
            show &&
            setShow(false);
    });

    const newChildren = (Array.isArray(children) ? children : [children]).map(
        (c, i) => (
            <DropdownItem key={i} setShow={setShow}>
                {c}
            </DropdownItem>
        )
    );

    return (
        <div ref={parentRef} className={'cursor-pointer relative ' + className}>
            <p
                onClick={(ev) => {
                    ev.preventDefault();
                    setShow(!show);
                }}
            >
                ACCIONES
            </p>

            <ul
                className="absolute z-20 border border-gray-400 shadow-lg"
                hidden={!show}
            >
                {newChildren}
            </ul>
        </div>
    );
}

function DropdownItem({ children, setShow, ...props }) {
    return <li {...props}>{children}</li>;
}
