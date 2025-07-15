import { useState, useRef, useEffect } from 'react';

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    currentImage?: string;
    maxSizeInMB?: number;
    acceptedFormats?: string[];
}

/**
 * Reusable image upload component with validation and preview
 * @param onImageSelect - Callback function when image is selected
 * @param currentImage - Current image URL for preview
 * @param maxSizeInMB - Maximum file size in MB (default: 5MB)
 * @param acceptedFormats - Accepted file formats (default: jpg, jpeg, png, webp)
 */
const ImageUpload = ({
    onImageSelect,
    currentImage,
    maxSizeInMB = 5,
    acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Update preview when currentImage prop changes
     */
    useEffect(() => {
        setPreview(currentImage || null);
    }, [currentImage]);

    /**
     * Validates the selected file against size and format constraints
     */
    const validateFile = (file: File): boolean => {
        setError('');

        if (!acceptedFormats.includes(file.type)) {
            setError('Formato no válido. Use JPG, PNG o WebP.');
            return false;
        }

        if (file.size > maxSizeInMB * 1024 * 1024) {
            setError(`El archivo es muy grande. Máximo ${maxSizeInMB}MB.`);
            return false;
        }

        return true;
    };

    /**
     * Handles file selection and creates preview
     */
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!validateFile(file)) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPreview(result);
            onImageSelect(file);
        };
        reader.onerror = () => {
            setError('Error al leer el archivo');
        };
        reader.readAsDataURL(file);
    };

    /**
     * Triggers file input click
     */
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <div className="bg-gray-100 border-4 border-gray-200 rounded-full w-32 h-32 overflow-hidden">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex justify-center items-center w-full h-full text-gray-400">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleUploadClick}
                    className="right-0 bottom-0 absolute bg-blue-500 hover:bg-blue-600 shadow-lg p-2 rounded-full text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleFileSelect}
                className="hidden"
            />

            <button
                onClick={handleUploadClick}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white transition-colors"
            >
                Cambiar foto
            </button>

            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}
        </div>
    );
};

export default ImageUpload;
