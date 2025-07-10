import { useEffect, useState } from "react";

/**
 * Construye la URL completa de la imagen
 * @param imageUrl - URL de la imagen desde Strapi
 * @returns URL completa de la imagen
 */
const buildImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    return `${import.meta.env.VITE_STRAPI_URL}${imageUrl}`;
};

/**
 * Hook personalizado para manejar la carga lazy de imágenes
 * @param src - URL de la imagen
 * @returns Estado de carga de la imagen
 */
const useImageLoader = (src: string) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');

    useEffect(() => {
        if (!src) return;

        setImageLoaded(false);
        setImageError(false);

        const fullImageUrl = buildImageUrl(src);
        setImageUrl(fullImageUrl);

        const img = new Image();

        img.onload = () => {
            setImageLoaded(true);
            setImageError(false);
        };

        img.onerror = () => {
            setImageError(true);
            setImageLoaded(false);
        };

        img.src = fullImageUrl;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    return { imageLoaded, imageError, imageUrl };
};

/**
 * Componente para lazy loading de imágenes con manejo de errores
 * @param src - URL de la imagen
 * @param alt - Texto alternativo
 * @param className - Clases CSS
 */
function LazyImage({ src, alt, className }: { src: string; alt: string; className: string }) {
    const { imageLoaded, imageError, imageUrl } = useImageLoader(src);

    if (imageError) {
        return (
            <div className={`${className} flex justify-center items-center bg-gray-100 text-gray-400`}>
                <span className="text-sm">Error loading image</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {!imageLoaded && (
                <div className={`${className} absolute inset-0 flex justify-center items-center bg-gray-100 animate-pulse`}>
                    <div className="text-gray-400 text-sm">Loading image...</div>
                </div>
            )}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={alt}
                    className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    onLoad={() => { }} // Ya manejado por el hook
                />
            )}
        </div>
    );
}

export default LazyImage;