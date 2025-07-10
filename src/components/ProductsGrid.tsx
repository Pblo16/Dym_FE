import type Product from "@/interfaces/product";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel } from "@/components/Carousel";
import { NavLink } from "react-router";
import LazyImage from "./LazyImage";

interface ProductsApiResponse {
    data: Product[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

interface ProductsGridProps {
    sortOrder?: string;
    limit?: number | null;
    className?: string;
    displayMode?: 'grid' | 'carousel';
    itemsPerView?: number;
}



/**
 * Hook personalizado para obtener productos de la API
 * @param sortOrder - Orden de clasificación
 * @param limit - Límite de productos a obtener
 */
const useProducts = (sortOrder: string, limit: number | null) => {
    const [data, setData] = useState<Product[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const baseUrl = import.meta.env.VITE_STRAPI_URL as string;
                const url = `${baseUrl}/api/products?populate=*&sort[0]=${sortOrder}&pagination[limit]=${limit}`;

                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
                    },
                });

                const apiResponse: ProductsApiResponse = await response.json();
                setData(apiResponse.data);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [sortOrder, limit]);

    return { data, error, loading };
};



/**
 * Componente para renderizar una tarjeta de producto individual
 * @param product - Datos del producto
 */
const ProductCard = ({ product }: { product: Product }) => (
    <NavLink to={`/products/${product.documentId}`} className="no-underline">
        <Card className="shadow-lg pt-0 rounded-md h-96 overflow-hidden">
            <AspectRatio ratio={16 / 9}>
                <LazyImage
                    src={product.picture[0].url}
                    alt={product.name}
                    className="rounded-md w-full h-full object-cover"
                />
            </AspectRatio>
            <CardContent className="grid grid-cols-[1fr_1fr] h-full">
                <div className="flex flex-col justify-between pr-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
                <div className="flex justify-end items-end">
                    <p className="font-bold text-2xl">${product.price}</p>
                </div>
            </CardContent>
        </Card>
    </NavLink>
);

/**
 * Componente ProductsGrid - Muestra productos en grid o carousel
 * @param sortOrder - Orden de clasificación de productos
 * @param limit - Límite de productos a mostrar
 * @param className - Clases CSS adicionales
 * @param displayMode - Modo de visualización: 'grid' o 'carousel'
 * @param itemsPerView - Número de elementos visibles en modo carousel
 */
export function ProductsGrid({
    sortOrder = "createdAt:desc",
    limit = null,
    className,
    displayMode = 'grid',
    itemsPerView = 4
}: ProductsGridProps) {
    const { data, error, loading } = useProducts(sortOrder, limit);

    if (error) return (
        <div className="flex flex-col text-center">
            <p className="text-2xl">Error: {error}</p>
            <AspectRatio ratio={1 / 1}>
                <img src="src/assets/error.webp" alt="Error" className="rounded-md size-96 object-contain" />
            </AspectRatio>
        </div>
    );

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="border-primary border-b-2 rounded-full w-32 h-32 animate-spin"></div>
        </div>
    );

    if (!data || data.length === 0) return (
        <div className="text-muted-foreground text-center">
            No hay productos disponibles
        </div>
    );

    const productCards = data.map(product => (
        <ProductCard key={product.id} product={product} />
    ));

    if (displayMode === 'carousel') {
        return (
            <Carousel
                className={className}
                itemsPerView={itemsPerView}
                showPeekOnSmall={true}
            >
                {productCards}
            </Carousel>
        );
    }

    return (
        <div className={`gap-4 ${className ? className : 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3'}`}>
            {productCards}
        </div>
    );
}
