import React, { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            autoRaf: true,
        });

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
