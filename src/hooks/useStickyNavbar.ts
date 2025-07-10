import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Interfaz para el retorno del hook useStickyNavbar optimizado
 */
interface StickyNavbarReturn {
    isSticky: boolean;
    navbarRef: React.RefObject<HTMLElement>;
    sentinelRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook optimizado para navbar sticky sin "brinquitos" usando Intersection Observer
 * @param rootMargin - Margen para el observer (default: "0px")
 * @returns Objeto con estado sticky y refs necesarias
 */
export function useStickyNavbar(rootMargin: string = "0px"): StickyNavbarReturn {
    const [isSticky, setIsSticky] = useState(false);

    // Los tipos de useRef deben ser exactamente HTMLElement y HTMLDivElement
    const navbarRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;
    const sentinelRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    /**
     * Callback para el Intersection Observer
     * @param entries - Entradas del observer
     */
    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        // Cuando el sentinel no es visible, el navbar debe ser sticky
        setIsSticky(!entry.isIntersecting);
    }, []);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const navbar = navbarRef.current;

        if (!sentinel || !navbar) return;

        // Configurar Intersection Observer
        const observer = new IntersectionObserver(handleIntersection, {
            rootMargin,
            threshold: 0,
        });

        // Observar el elemento sentinel
        observer.observe(sentinel);

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, [handleIntersection, rootMargin]);

    return {
        isSticky,
        navbarRef,
        sentinelRef
    };
}
