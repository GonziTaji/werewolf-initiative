import { useEffect, useRef, useState } from 'react';
import { ComponentBaseProps } from '../interfaces';

// https://bionicjulia.com/blog/creating-accordion-component-react-typescript-tailwind

interface CollapsableProps extends ComponentBaseProps {
    className?: string;
    collapsed?: boolean;
}

const Collapsable = ({
    children,
    collapsed,
    className = '',
    ...props
}: CollapsableProps) => {
    const childrenParent = useRef(null);

    return (
        <div
            {...props}
            style={{
                height: collapsed
                    ? '0px'
                    : `${childrenParent.current?.scrollHeight}px`,
            }}
            className={
                className +
                ' overflow-hidden transition-max-height transform duration-300 ease-in-out '
            }
        >
            <div ref={childrenParent}>{children}</div>
        </div>
    );
};

export default Collapsable;
