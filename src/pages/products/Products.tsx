import type Product from "@/interfaces/product";
import { useState, useEffect } from "react";

import { Filter } from "@/components/Filter";
import { ProductsGrid } from "@/components/ProductsGrid";


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
    const [limit] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_4fr] py-4">
            <Filter sortOrder={sortOrder} setSortOrder={setSortOrder} title="Filtrar Productos" />
            <ProductsGrid sortOrder={sortOrder} limit={limit} />
        </div>
    )
}



export default Products
