// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Atrapa el foco (Tab / Shift+Tab) dentro de `containerRef` mientras `active` sea true,
 * lo mueve al contenedor al activarse y lo devuelve al elemento que lo tenía
 * al desactivarse o desmontarse. Lo usan los modales y el chat en pantalla completa.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!active) return;

        previouslyFocused.current = document.activeElement as HTMLElement | null;

        const container = containerRef.current;
        const focusables = () =>
            container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];

        const first = focusables()[0];
        (first ?? container)?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab' || !container) return;
            const items = focusables();
            if (items.length === 0) {
                e.preventDefault();
                return;
            }
            const firstEl = items[0];
            const lastEl = items[items.length - 1];
            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            previouslyFocused.current?.focus?.();
        };
    }, [active, containerRef]);
}
