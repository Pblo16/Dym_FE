import { Hero } from "@/components/Hero"
import { ProductsGrid } from "@/components/ProductsGrid"
import { useScreenSize } from "@/hooks/useScreenSize"
import About from "./About/About";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { SquareArrowOutUpRight } from "lucide-react";

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

            <section className="flex flex-col items-center gap-8 py-12">
                <h2 className="self-start mb-8 font-semibold text-2xl">Productos Destacados</h2>
                <ProductsGrid
                    sortOrder="createdAt:asc"
                    limit={6}
                    displayMode="carousel"
                    itemsPerView={calculateItemsPerView()}
                    className="w-full"
                />
                <NavLink to="/products" className="">
                    <Button variant="ghost">
                        Ver todos los productos
                        <SquareArrowOutUpRight />
                        <span className="sr-only">Ver todos los productos</span>
                    </Button>
                </NavLink>
            </section>

            <About />
        </>
    )
}

export default Home
