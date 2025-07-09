import type Product from "@/interfaces/product";
import { useState, useEffect } from "react";

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

import { Button } from "@/components/ui/button";
import { Filter } from "@/components/Filter";



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

function Products() {
    const [sortOrder, setSortOrder] = useState<string>("createdAt:desc");
    const [limit, setLimit] = useState<number | null>(null);
    const [data, setData] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        setData(null);

        // Use regular fetch instead of the Suspense-based fetchData
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
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }, [sortOrder, limit]);

    return (
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_4fr] py-4">
            <Filter sortOrder={sortOrder} setSortOrder={setSortOrder} title="Filtrar Productos" />

            {data && (
                <div className="gap-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 xl:grid-cols-4">
                    {data.map(product => (
                        <Card className="shadow-lg rounded-md min-h-96 overflow-hidden" key={product.id} >
                            {product.picture && product.picture[0].url && (
                                <AspectRatio ratio={16 / 9}>
                                    <img src={import.meta.env.VITE_STRAPI_URL + product.picture[0].url} alt={product.name} className="rounded-md w-full h-full object-contain" />
                                </AspectRatio>
                            )}
                            <CardContent className="flex flex-col justify-between p-6 h-full">
                                <div className="mb-4">

                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    <p className="overflow-hidden text-muted-foreground text-ellipsis whitespace-nowrap">{product.description}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-2xl">${product.price}</span>
                                    <Button variant="outline">Add to Cart</Button>
                                </div>
                            </CardContent>

                        </Card>

                    ))}
                </div>
            )}
        </div>
    )
}



export default Products
