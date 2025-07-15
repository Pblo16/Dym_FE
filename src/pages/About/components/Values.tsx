import type { JSX } from 'react';
import { Heart, Shield, Lightbulb, Crown } from 'lucide-react';
import LazyImage from '@/components/LazyImage';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

/**
 * Interface defining the structure of a company value (simplified)
 */
interface CompanyValue {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

/**
 * Interface defining the structure of an image card
 */
interface ImageCard {
    id: string;
    type: 'image';
    imageUrl: string;
    altText: string;
    caption?: string;
}

/**
 * Union type for different card types
 */
type CardData = CompanyValue | ImageCard;

/**
 * Enhanced company values data with image card as first element
 */
const CARD_DATA: CardData[] = [
    {
        id: 'team-image',
        type: 'image' as const,
        imageUrl: 'https://centromedicoabc.com/storage/2023/08/shutterstock_1028408488.webp',
        altText: 'Equipo trabajando en valores empresariales',
    },
    {
        id: 'loyalty',
        title: 'Lealtad',
        description: 'Reciprocidad, fidelidad y gratitud para aquellos que confiaron y confían en nosotros para crecer juntos.',
        icon: Heart
    },
    {
        id: 'integrity',
        title: 'Integridad',
        description: 'Buscar siempre que todos nuestros actos en el entorno laboral y personal sean éticos, congruentes, coherentes y rectos.',
        icon: Shield
    },
    {
        id: 'innovation',
        title: 'Innovación colaborativa',
        description: 'Prepararnos constantemente para poder proponer más y/o mejores formas de ejecutar nuestros servicios y actividades.',
        icon: Lightbulb
    },
    {
        id: 'leadership',
        title: 'Liderazgo',
        description: 'Buscar la excelencia en nuestra conducción y calidad como personas y profesionales.',
        icon: Crown
    }
];

/**
 * Type guard to check if card is a company value
 * @param card - Card data to check
 * @returns true if card is CompanyValue, false otherwise
 */
const isCompanyValue = (card: CardData): card is CompanyValue => {
    return !('type' in card);
};

/**
 * Type guard to check if card is an image card
 * @param card - Card data to check
 * @returns true if card is ImageCard, false otherwise
 */
const isImageCard = (card: CardData): card is ImageCard => {
    return 'type' in card && card.type === 'image';
};

/**
 * Generates responsive grid classes for centered image layout with values surrounding it
 * Layout: 4x4 grid with image in center (2x2) and values in corners
 * @param index - Position index of the card
 * @returns CSS classes for responsive grid positioning
 */
const generateEnhancedGridClasses = (index: number): string => {
    const desktopClasses = [
        'md:col-span-2 md:row-span-1 hidden md:block', // image - center (2x2)
        'md:col-span-2 md:row-span-1 ', // loyalty - top left (2x1)
        'md:col-span-1 md:row-span-3 ', // integrity - top right (2x1)
        'md:col-span-3 md:row-span-2 ', // innovation - bottom left (2x1)
        'md:col-span-3 md:row-span-1 '  // leadership - bottom right (2x1)
    ];

    return `col-span-1 ${desktopClasses[index] || ''}`;
};

/**
 * Props interface for ValueCard component
 */
interface ValueCardProps {
    value: CompanyValue;
    index: number;
}

/**
 * Props interface for ImageCard component
 */
interface ImageCardProps {
    imageData: ImageCard;
    index: number;
}

/**
 * Renders an icon component with consistent styling
 * @param IconComponent - The Lucide icon component to render
 * @returns JSX element containing the styled icon
 */
const ValueIcon: React.FC<{ IconComponent: React.ComponentType<{ size?: number; className?: string }> }> = ({ IconComponent }) => {
    return (
        <IconComponent
            size={24}
            className="flex-shrink-0 mb-1 text-indigo-600"
            aria-hidden="true"
        />
    );
};


/**
 * Image card component with responsive design
 * @param imageData - Image card data containing URL and caption
 * @param index - Position index for grid layout
 * @returns JSX element representing an image card
 */
const ImageCardComponent: React.FC<ImageCardProps> = ({ imageData, index }) => {
    const gridClasses = generateEnhancedGridClasses(index);

    return (
        <div className={`${gridClasses} bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden`}>
            <div className="flex flex-col h-full">
                <div className="relative flex-1">
                    <AspectRatio ratio={16 / 5}>
                        <LazyImage
                            src={imageData.imageUrl}
                            alt={imageData.altText}
                            className="w-full h-full object-cover"
                        />
                    </AspectRatio>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                {imageData.caption && (
                    <div className="p-3 md:p-4">
                        <p className="text-gray-600 md:text- text-xs leading-relaxed">
                            {imageData.caption}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Value card header containing icon and title
 * @param title - The title text to display
 * @param IconComponent - The icon component to render
 * @returns JSX element for the card header
 */
const ValueCardHeader: React.FC<{
    title: string;
    IconComponent: React.ComponentType<{ size?: number; className?: string }>
}> = ({ title, IconComponent }) => {
    return (
        <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
            <ValueIcon IconComponent={IconComponent} />
            <h3 className="font-bold text-gray-800 text-lg md:text-xl">
                {title}
            </h3>
        </div>
    );
};

/**
 * Value card content component containing description
 * @param description - The description text to display
 * @returns JSX element for the card content
 */
const ValueCardContent: React.FC<{ description: string }> = ({ description }) => {
    return (
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {description}
        </p>
    );
};

/**
 * Enhanced individual value card component
 * @param value - Company value object containing title, description and icon
 * @param index - Position index for grid layout
 * @returns JSX element representing a single value card
 */
const EnhancedValueCard: React.FC<ValueCardProps> = ({ value, index }) => {
    const gridClasses = generateEnhancedGridClasses(index);

    return (
        <div className={`${gridClasses} bg-gradient-to-br from-blue-50 rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:scale-105`}>
            <ValueCardHeader title={value.title} IconComponent={value.icon} />
            <ValueCardContent description={value.description} />
        </div>
    );
};

/**
 * Renders all cards (values and image) with proper indexing and type handling
 * @returns Array of card components (ValueCard or ImageCard)
 */
const renderAllCards = (): JSX.Element[] => {
    return CARD_DATA.map((card, index) => {
        if (isImageCard(card)) {
            return (
                <ImageCardComponent
                    key={card.id}
                    imageData={card}
                    index={index}
                />
            );
        }

        if (isCompanyValue(card)) {
            return (
                <EnhancedValueCard
                    key={card.id}
                    value={card}
                    index={index}
                />
            );
        }

        return null;
    }).filter(Boolean) as JSX.Element[];
};

/**
 * Page header component with responsive typography
 * @returns JSX element containing the page title and description
 */
const ValuesHeader: React.FC = () => {
    return (
        <div className="mb-8 md:mb-12 px-4 text-center">
            <h1 className="mb-3 md:mb-4 font-bold text-gray-900 text-2xl md:text-4xl">
                Nuestros Valores
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-lg leading-relaxed">
                Los principios que guían nuestro trabajo y definen nuestra cultura empresarial
            </p>
        </div>
    );
};

/**
 * Values page component displaying company values and image in a responsive centered grid layout
 * Features image in center with values surrounding it in a 4x4 grid system
 * @returns JSX element containing the complete Values page
 */
const Values: React.FC = () => {
    return (
        <section className="flex flex-col justify-evenly py-8 md:py-12 min-h-screen">
            <ValuesHeader />
            <div className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-4 mx-auto px-4 max-w-6xl">
                {renderAllCards()}
            </div>
        </section>
    );
};

export default Values;
