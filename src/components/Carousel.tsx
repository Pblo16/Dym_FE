import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScreenSize } from '@/hooks/useScreenSize';

interface CarouselProps {
    children: React.ReactNode[];
    className?: string;
    itemsPerView?: number;
    gap?: number;
    showPeekOnSmall?: boolean;
}

/**
 * Componente Carousel reutilizable con efecto peek en pantallas pequeñas
 * @param children - Array de elementos a mostrar en el carousel
 * @param className - Clases CSS adicionales
 * @param itemsPerView - Número de elementos visibles por página
 * @param gap - Espacio entre elementos en píxeles
 * @param showPeekOnSmall - Si mostrar un peek del siguiente elemento en pantallas pequeñas
 */
export function Carousel({
    children,
    className = '',
    itemsPerView = 4,
    gap = 16,
    showPeekOnSmall = true
}: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isSm, isXs } = useScreenSize();

    const totalItems = children.length;

    /**
     * Calcula el porcentaje de peek a mostrar en pantallas pequeñas
     * @returns {number} Porcentaje del siguiente elemento a mostrar
     */
    const getPeekPercentage = (): number => {
        if (!showPeekOnSmall || (!isSm && !isXs)) return 0;
        return 15; // Mostrar 15% del siguiente elemento
    };

    /**
     * Calcula el ancho efectivo de cada item considerando el peek
     * @returns {number} Porcentaje de ancho por item
     */
    const getItemWidth = (): number => {
        const peekPercentage = getPeekPercentage();
        if (peekPercentage > 0) {
            // En pantallas pequeñas con peek, ajustar el ancho
            return (100 - peekPercentage) / itemsPerView;
        }
        return 100 / itemsPerView;
    };

    const maxIndex = Math.max(0, totalItems - itemsPerView);

    /**
     * Actualiza el estado de los botones de navegación
     * @param index - Índice actual del carousel
     */
    const updateNavigationState = (index: number) => {
        setCanScrollLeft(index > 0);
        setCanScrollRight(index < maxIndex);
    };

    /**
     * Navega al índice anterior
     */
    const scrollToPrevious = () => {
        if (canScrollLeft) {
            const newIndex = Math.max(0, currentIndex - 1);
            setCurrentIndex(newIndex);
            updateNavigationState(newIndex);
        }
    };

    /**
     * Navega al índice siguiente
     */
    const scrollToNext = () => {
        if (canScrollRight) {
            const newIndex = Math.min(maxIndex, currentIndex + 1);
            setCurrentIndex(newIndex);
            updateNavigationState(newIndex);
        }
    };

    useEffect(() => {
        updateNavigationState(currentIndex);
    }, [currentIndex, maxIndex]);

    const itemWidthPercentage = getItemWidth();
    const translateX = -(currentIndex * itemWidthPercentage);

    return (
        <div className={`relative ${className}`}>
            <div
                ref={containerRef}
                className="overflow-hidden"
            >
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(${translateX}%)`,
                        gap: `${gap}px`
                    }}
                >
                    {children.map((child, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0"
                            style={{
                                width: `calc(${itemWidthPercentage}% - ${gap * (itemsPerView - 1) / itemsPerView}px)`
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Controles de navegación */}
            <Button
                variant="outline"
                size="icon"
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={scrollToPrevious}
                disabled={!canScrollLeft}
                aria-label="Elemento anterior"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={scrollToNext}
                disabled={!canScrollRight}
                aria-label="Elemento siguiente"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
