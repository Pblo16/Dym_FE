import { useEffect, useState } from "react";

// Componente para lazy loading de imágenes
function LazyImage({ src, alt, className }: { src: string; alt: string; className: string }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImageSrc(src);
            setImageLoaded(true);
        };
        img.src = src;
    }, [src]);

    return (
        <div className="relative w-full h-full">
            {!imageLoaded && (
                <div className="absolute inset-0 flex justify-center items-center rounded-md animate-pulse">
                    <div className="text-gray-400 text-sm">Loading image...</div>
                </div>
            )}
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={alt}
                    className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    onLoad={() => setImageLoaded(true)}
                />
            )}
        </div>
    );
}

export default LazyImage;