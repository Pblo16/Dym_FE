import { NavLink, useLocation } from "react-router";


/**
 * Componente que muestra una página de error 404
 * Incluye información contextual sobre la ruta no encontrada
 */
export function NotFound() {
    const location = useLocation();

    return (
        <div className="flex flex-col justify-center items-center px-4 h-[calc(100vh-90px)]">
            <h1 className="mb-4 font-bold text-4xl">404 - Página No Encontrada</h1>
            <p className="mb-2 text-gray-600 text-lg">
                La página que buscas no existe.
            </p>
            <p className="mb-8 text-gray-500 text-sm">
                Ruta solicitada: <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code>
            </p>
            <div className="flex gap-4">
                <NavLink
                    to="/"
                    className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold text-primary-foreground transition-colors"
                >
                    Ir al Inicio
                </NavLink>
                <NavLink
                    to="/products"
                    className="hover:bg-primary/10 px-6 py-3 border border-primary rounded-lg font-semibold text-primary transition-colors"
                >
                    Ver Productos
                </NavLink>
            </div>
        </div>
    );
}