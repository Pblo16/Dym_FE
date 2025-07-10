import LazyImage from "@/components/LazyImage";
import type Product from "@/interfaces/product";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface ProductApiResponse {
    data: Product;
    meta: {};
}

/**
 * Hook personalizado para obtener un producto específico por ID
 * @param productId - ID del producto a obtener
 * @returns Objeto con data, error y loading del producto
 */
const useProduct = (productId: string | undefined) => {
    const [data, setData] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!productId) {
            setError("ID del producto no proporcionado");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const baseUrl = import.meta.env.VITE_STRAPI_URL as string;
                const url = `${baseUrl}/api/products/${productId}?populate=*`;

                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const apiResponse: ProductApiResponse = await response.json();
                setData(apiResponse.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                setError("No se pudo cargar el producto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { data, error, loading };
};

/**
 * Componente Detail - Muestra los detalles de un producto específico
 * @returns JSX del componente de detalle del producto
 */
const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, error, loading } = useProduct(id);

    // Validación adicional para ID inválido
    if (!id) {
        return (
            <div className="text-center">
                <h2 className="mb-4 font-bold text-2xl">ID de producto inválido</h2>
                <p className="text-muted-foreground">No se proporcionó un ID válido para el producto.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-96">
                <div className="border-primary border-b-2 rounded-full w-16 h-16 animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Cargando producto...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center text-center">
                <h2 className="mb-4 font-bold text-destructive text-2xl">Error</h2>
                <p className="text-lg">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center">
                <h2 className="mb-4 font-bold text-2xl">Producto no encontrado</h2>
                <p className="text-muted-foreground">El producto solicitado no existe.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto p-6 max-w-4xl">
            <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
                {/* Imagen del producto */}
                <div className="space-y-4">
                    {product.picture && product.picture[0]?.url && (
                        <LazyImage
                            src={product.picture[0].url}
                            alt={product.name}
                            className="rounded-md w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Información del producto */}
                <div className="space-y-6">
                    <div>
                        <h1 className="mb-2 font-bold text-3xl">{product.name}</h1>
                        <p className="font-semibold text-primary text-2xl">${product.price}</p>
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold text-lg">Descripción</h3>
                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    </div>

                    <div className="pt-4">
                        <button className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold text-primary-foreground transition-colors">
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;