import {
    Card,
    CardContent,
} from "@/components/ui/card";

interface InfoCardProps {
    /** Título del card (ej: "Visión", "Misión") */
    title: string;
    /** Contenido de texto del card */
    content: string;
}

/**
 * Componente reutilizable para mostrar información en formato de tarjeta
 * @param title - Título que se mostrará en el encabezado
 * @param content - Contenido de texto que se mostrará en el cuerpo
 * @returns JSX.Element - Tarjeta con título y contenido
 */
const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
    return (
        <Card className='flex flex-col rounded-4xl rounded-tr-none w-full h-full'>
            <CardContent className="flex-1">
                <h3 className='font-semibold text-4xl'>{title}</h3>
                <p className="mt-4 text-gray-700 leading-relaxed">{content}</p>
            </CardContent>
        </Card>
    );
};

export default InfoCard;
