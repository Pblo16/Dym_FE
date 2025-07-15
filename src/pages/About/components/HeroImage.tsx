import React from 'react';
import { Card } from "@/components/ui/card";
import LazyImage from '@/components/LazyImage';

/**
 * Componente para mostrar la imagen hero de la página About
 * Se ajusta automáticamente a la altura de las tarjetas adyacentes
 * @returns JSX.Element - Tarjeta con imagen que ocupa toda la altura disponible
 */
const HeroImage: React.FC = () => {
    return (
        <Card className="flex flex-col col-span-2 md:col-span-1 p-0 rounded-4xl rounded-tr-none w-full h-full overflow-hidden">
            <LazyImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe74fIHF5o3c3bN8sr0FLr_4NHlM_GeUaucA&s"
                alt="Imagen representativa de la empresa"
                className="flex-1 w-full h-full object-cover"
            />
        </Card>
    );
};

export default HeroImage;
