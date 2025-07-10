import { useState, useEffect } from 'react';

/**
 * Breakpoints de Tailwind CSS (en píxeles)
 */
const TAILWIND_BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;

/**
 * Tipo para los tamaños de pantalla disponibles
 */
type ScreenSizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Determina el breakpoint actual basado en el ancho de ventana
 * @param width - Ancho de la ventana en píxeles
 * @returns {ScreenSizeType} Breakpoint actual
 */
const calculateScreenSize = (width: number): ScreenSizeType => {
    if (width < TAILWIND_BREAKPOINTS.sm) return 'xs';
    if (width < TAILWIND_BREAKPOINTS.md) return 'sm';
    if (width < TAILWIND_BREAKPOINTS.lg) return 'md';
    if (width < TAILWIND_BREAKPOINTS.xl) return 'lg';
    return 'xl';
};

/**
 * Hook personalizado para detectar el tamaño de pantalla y breakpoints responsivos
 * @returns {Object} Estado de los breakpoints y utilidades de detección
 */
export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState<ScreenSizeType>(() => {
        // Manejo seguro para SSR
        if (typeof window === 'undefined') return 'lg';
        return calculateScreenSize(window.innerWidth);
    });

    useEffect(() => {
        /**
         * Manejador para actualizar el breakpoint cuando cambie el tamaño de ventana
         */
        const handleResize = () => {
            const newSize = calculateScreenSize(window.innerWidth);
            setScreenSize(newSize);
        };

        // Agregar listener para cambios de tamaño
        window.addEventListener('resize', handleResize);

        // Cleanup del listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        screenSize,
        // Utilidades de detección por breakpoint
        isXs: screenSize === 'xs',
        isSm: screenSize === 'sm',
        isMd: screenSize === 'md',
        isLg: screenSize === 'lg',
        isXl: screenSize === 'xl',
        // Utilidades de detección por rango
        isMobile: screenSize === 'xs' || screenSize === 'sm',
        isTablet: screenSize === 'md',
        isDesktop: screenSize === 'lg' || screenSize === 'xl',
        // Utilidades de comparación
        isSmallScreen: screenSize === 'xs' || screenSize === 'sm',
        isLargeScreen: screenSize === 'lg' || screenSize === 'xl',
    };
};
