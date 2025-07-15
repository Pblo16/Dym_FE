import LazyImage from "@/components/LazyImage";
import { ProductsGrid } from "@/components/ProductsGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScreenSize } from "@/hooks/useScreenSize";
import type Product from "@/interfaces/product";
import { SquareArrowOutUpRight, Phone, Mail, FileText, Package, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { apiGet } from "@/api/config";

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
                const endpoint = `/api/products/${productId}?populate=*`;
                const apiResponse: ProductApiResponse = await apiGet(endpoint);
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
 * Componente para mostrar estados de error
 * @param title - Título del error
 * @param message - Mensaje descriptivo del error
 */
const ErrorState = ({ title, message }: { title: string; message: string }) => (
    <div className="flex flex-col items-center text-center">
        <h2 className="mb-4 font-bold text-destructive text-2xl">{title}</h2>
        <p className="text-lg">{message}</p>
    </div>
);

/**
 * Componente para mostrar estado de carga
 */
const LoadingState = () => (
    <div className="flex flex-col justify-center items-center h-96">
        <div className="border-primary border-b-2 rounded-full w-16 h-16 animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Cargando información del producto...</p>
    </div>
);


const B2BActions = () => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Solicitar Información Comercial
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
                Conecta con nuestro equipo comercial para obtener cotizaciones personalizadas,
                descuentos por volumen y condiciones especiales para tu empresa.
            </p>

            <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
                <Button className="flex items-center gap-2" variant="default">
                    <FileText className="w-4 h-4" />
                    Solicitar Cotización
                </Button>

                <Button className="flex items-center gap-2" variant="outline">
                    <Phone className="w-4 h-4" />
                    Contactar Asesor
                </Button>
            </div>

            <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="w-4 h-4" />
                    <span>ventas@empresa.com</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

/**
 * Componente para mostrar información técnica del producto
 * @param product - Objeto producto con los datos
 */
const TechnicalInfo = ({ product }: { product: Product }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Especificaciones Técnicas
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="font-medium">Precio base:</span>
                    <span className="font-semibold text-primary text-lg">${product.price}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-medium">Disponibilidad:</span>
                    <Badge variant="secondary">En Stock</Badge>
                </div>

                <div className="flex justify-between">
                    <span className="font-medium">Pedido mínimo:</span>
                    <span>1 unidad</span>
                </div>

                <div className="pt-3 border-t">
                    <p className="text-muted-foreground text-sm">
                        * Precios sujetos a condiciones comerciales y volumen de pedido.
                        Consulta descuentos por cantidad y términos de pago.
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);

/**
 * Componente principal de visualización del producto
 * @param product - Datos del producto a mostrar
 */
const ProductDisplay = ({ product }: { product: Product }) => (
    <div className="mx-auto p-6 max-w-6xl">
        <div className="lg:items-start gap-8 grid grid-cols-1 lg:grid-cols-2">
            {/* Imagen del producto - Columna izquierda */}
            <div className="flex flex-col h-full min-h-[500px] lg:min-h-[600px]">
                {product.picture && product.picture[0]?.url && (
                    <LazyImage
                        src={product.picture[0].url}
                        alt={product.name}
                        className="flex-1 shadow-lg rounded-lg w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Información del producto - Columna derecha */}
            <div className="space-y-6">
                <div>
                    <h1 className="mb-4 font-bold text-3xl">{product.name}</h1>
                    <p className="mb-6 text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                <TechnicalInfo product={product} />
                <B2BActions />
            </div>
        </div>
    </div>
);

/**
 * Componente Detail - Muestra los detalles de un producto con enfoque B2B
 * @returns JSX del componente de detalle del producto para empresas
 */
const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, error, loading } = useProduct(id);
    const { isMobile, isTablet } = useScreenSize();

    /**
     * Calcula la cantidad de items por vista según el breakpoint actual
     * @returns {number} Número de items a mostrar por vista
        */
    const calculateItemsPerView = (): number => {
        if (isMobile) return 1;    // xs, sm
        if (isTablet) return 2;    // md
        return 4;                  // lg, xl
    };

    // Validación adicional para ID inválido
    if (!id) {
        return <ErrorState title="ID de producto inválido" message="No se proporcionó un ID válido para el producto." />;
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState title="Error" message={error} />;
    }

    if (!product) {
        return <ErrorState title="Producto no encontrado" message="El producto solicitado no existe en nuestro catálogo." />;
    }

    return (
        <>
            <ProductDisplay product={product} />

            <section className="bg-muted/30 py-16">
                <div className="mx-auto px-6 container">
                    <div className="flex flex-col items-center gap-8">
                        <div className="max-w-2xl text-center">
                            <h2 className="mb-4 font-semibold text-3xl">Productos Relacionados</h2>
                            <p className="text-muted-foreground">
                                Descubre otros productos que podrían interesar a tu empresa
                            </p>
                        </div>

                        <ProductsGrid
                            sortOrder="createdAt:asc"
                            limit={6}
                            displayMode="carousel"
                            itemsPerView={calculateItemsPerView()}
                            className="w-full"
                        />

                        <NavLink to="/products">
                            <Button variant="outline" size="lg">
                                Ver catálogo completo
                                <SquareArrowOutUpRight className="w-4 h-4" />
                                <span className="sr-only">Ver catálogo completo de productos</span>
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Detail;