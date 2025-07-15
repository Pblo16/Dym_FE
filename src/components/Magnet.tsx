import { useState, useEffect, useRef, type ReactNode } from "react";

/**
 * Interface para la posición del cursor
 */
interface Position {
    x: number;
    y: number;
}

/**
 * Props del componente Magnet
 */
interface MagnetProps {
    children: ReactNode;
    padding?: number;
    disabled?: boolean;
    magnetStrength?: number;
    activeTransition?: string;
    inactiveTransition?: string;
    wrapperClassName?: string;
    innerClassName?: string;
    [key: string]: any; // Para props adicionales
}

/**
 * Componente que crea un efecto magnético al pasar el cursor sobre él
 * @param props - Propiedades del componente
 * @returns Elemento JSX con efecto magnético
 */
const Magnet: React.FC<MagnetProps> = ({
    children,
    padding = 100,
    disabled = false,
    magnetStrength = 2,
    activeTransition = "transform 0.3s ease-out",
    inactiveTransition = "transform 0.5s ease-in-out",
    wrapperClassName = "",
    innerClassName = "",
    ...props
}) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const magnetRef = useRef<HTMLDivElement>(null);

    /**
     * Resetea la posición cuando el componente está deshabilitado
     */
    const resetPosition = (): void => {
        setPosition({ x: 0, y: 0 });
    };

    /**
     * Calcula el offset basado en la posición del cursor
     * @param mouseX - Posición X del cursor
     * @param mouseY - Posición Y del cursor
     * @param centerX - Centro X del elemento
     * @param centerY - Centro Y del elemento
     * @returns Objeto con las posiciones x e y calculadas
     */
    const calculateOffset = (
        mouseX: number,
        mouseY: number,
        centerX: number,
        centerY: number
    ): Position => {
        const offsetX = (mouseX - centerX) / magnetStrength;
        const offsetY = (mouseY - centerY) / magnetStrength;
        return { x: offsetX, y: offsetY };
    };

    /**
     * Verifica si el cursor está dentro del área magnética
     * @param distX - Distancia X desde el centro
     * @param distY - Distancia Y desde el centro
     * @param width - Ancho del elemento
     * @param height - Alto del elemento
     * @returns true si está dentro del área magnética
     */
    const isWithinMagneticArea = (
        distX: number,
        distY: number,
        width: number,
        height: number
    ): boolean => {
        return distX < width / 2 + padding && distY < height / 2 + padding;
    };

    useEffect(() => {
        if (disabled) {
            resetPosition();
            return;
        }

        /**
         * Maneja el movimiento del cursor para crear el efecto magnético
         * @param e - Evento del mouse
         */
        const handleMouseMove = (e: MouseEvent): void => {
            if (!magnetRef.current) return;

            const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const distX = Math.abs(centerX - e.clientX);
            const distY = Math.abs(centerY - e.clientY);

            if (isWithinMagneticArea(distX, distY, width, height)) {
                setIsActive(true);
                const newPosition = calculateOffset(e.clientX, e.clientY, centerX, centerY);
                setPosition(newPosition);
            } else {
                setIsActive(false);
                resetPosition();
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [padding, disabled, magnetStrength]);

    const transitionStyle = isActive ? activeTransition : inactiveTransition;

    return (
        <div
            ref={magnetRef}
            className={wrapperClassName}
            style={{ position: "relative", display: "inline-block" }}
            {...props}
        >
            <div
                className={innerClassName}
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    transition: transitionStyle,
                    willChange: "transform",
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Magnet;
