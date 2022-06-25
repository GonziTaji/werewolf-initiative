import { useEffect } from 'react';

export default function useEvent(
    event: string,
    handler: EventListenerOrEventListenerObject,
    passive = false
) {
    useEffect(() => {
        window.addEventListener(event, handler, passive);
        return () => window.removeEventListener(event, handler);
    });
}
