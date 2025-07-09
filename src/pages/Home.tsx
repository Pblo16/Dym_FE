import { Hero } from "@/components/Hero"
import { ProductsGrid } from "@/components/ProductsGrid"

function Index() {


    return (
        <>
            <Hero />
            <div className="py-8">
                <h2 className="mb-8 font-semibold text-2xl">Productos Destacados</h2>
                <ProductsGrid sortOrder="createdAt:asc" limit={3} />
            </div>
        </>
    )

}



export default Index
