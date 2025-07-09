import type Product from "@/interfaces/product";
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
}

export function ProductsGrid({ sortOrder = "createdAt:desc", limit = null }: ProductsGridProps) {
    const [data, setData] = useState<Product[] | null>(null);

    useEffect(() => {
        setData(null);

        const baseUrl = import.meta.env.VITE_STRAPI_URL as string;
        const url = `${baseUrl}/api/products?populate=*&sort[0]=${sortOrder}&pagination[limit]=${limit}`;

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
            },
        })
            .then(response => response.json())
            .then((apiResponse: ProductsApiResponse) => {
                setData(apiResponse.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, [sortOrder, limit]);

    if (!data) return null;

    return (
        <div className="gap-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {data.map(product => (
                <Card className="shadow-lg rounded-md min-h-96 overflow-hidden" key={product.id} >
                    {product.picture && product.picture[0].url && (
                        <AspectRatio ratio={16 / 9}>
                            <img src={import.meta.env.VITE_STRAPI_URL + product.picture[0].url} alt={product.name} className="rounded-md w-full h-full object-contain" />
                        </AspectRatio>
                    )}
                    <CardContent className="grid grid-cols-[1fr_1fr] p-6 h-full">
                        <div className="flex flex-col justify-between pr-4">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                        </div>
                        <div className="flex justify-end items-end">
                            <p className="font-bold text-2xl">${product.price}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
