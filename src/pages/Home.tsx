import { Hero } from "@/components/Hero"
import { ProductsGrid } from "@/components/ProductsGrid"
import { useScreenSize } from "@/hooks/useScreenSize"

/**
 * Página principal del sitio web
 * Muestra el hero y productos destacados en formato carousel responsivo
 */
function Home() {
    const { isMobile, isTablet } = useScreenSize()

    /**
     * Calcula la cantidad de items por vista según el breakpoint actual
     * @returns {number} Número de items a mostrar por vista
     */
    const calculateItemsPerView = (): number => {
        if (isMobile) return 1;    // xs, sm
        if (isTablet) return 2;    // md
        return 4;                  // lg, xl
    };

    return (
        <>
            <Hero />

            <section className="py-12">
                <h2 className="mb-8 font-semibold text-2xl">Productos Destacados</h2>
                <ProductsGrid
                    sortOrder="createdAt:asc"
                    limit={6}
                    displayMode="carousel"
                    itemsPerView={calculateItemsPerView()}
                    className="w-full"
                />
            </section>
        </>
    )
}

export default Home
