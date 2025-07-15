import { apiGet } from "@/api/config";
import LazyImage from "@/components/LazyImage";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useEffect, useState } from "react";

interface Client {
    id: number;
    documentId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    logo: {
        id: number;
        documentId: string;
        name: string;
        url: string;
        alternativeText?: string | null;
        width: number;
        height: number;
        formats?: {
            thumbnail?: {
                name: string;
                hash: string;
                ext: string;
                mime: string;
                path: string | null;
                width: number;
                height: number;
                size: number;
                sizeInBytes: number;
                url: string;
            };
        };
        hash: string;
        ext: string;
        mime: string;
        size: number;
        provider?: string;
        provider_metadata?: any;
        createdAt?: string;
        updatedAt?: string;
        publishedAt?: string;
    };
}

interface ClientsApiResponse {
    data: Client[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

/**
 * Valida si un cliente tiene datos válidos para renderizar
 * @param client - Datos del cliente a validar
 * @returns boolean indicando si el cliente es válido
 */
const isValidClient = (client: Client): boolean => {
    return !!(client?.name && client?.logo?.url);
};


/**
 * Renderiza un cliente individual con su logo
 * @param client - Datos del cliente
 * @param index - Índice para la key de React
 * @returns JSX Element del cliente o null si no es válido
 */
const renderClient = (client: Client, index: number) => {
    if (!isValidClient(client)) {
        console.warn(`Cliente inválido en índice ${index}:`, client);
        return null;
    }
    return (
        <div key={client.id || index} className="flex flex-col items-center">
            <AspectRatio ratio={16 / 9} className="saturate-50 hover:saturate-100 hover:scale-105 transition-all duration-300">
                <LazyImage
                    src={client.logo.url}
                    alt={client.logo.alternativeText || `${client.name} logo`}
                    className="mb-2 w-full h-full object-contain transition-all duration-700 ease-in-out"
                />
            </AspectRatio>
        </div>
    );
};

/**
 * Hook personalizado para obtener clientes de la API
 * @returns Objeto con datos, error y estado de carga
 */
const useClients = () => {
    const [data, setData] = useState<Client[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            setError(null);

            try {
                const endpoint = `/api/clients?populate=*&pagination[limit]=12`;
                const apiResponse: ClientsApiResponse = await apiGet(endpoint);

                if (apiResponse?.data) {
                    setData(apiResponse.data);
                } else {
                    throw new Error("Respuesta de API inválida");
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error desconocido al obtener clientes";
                console.error("Error fetching clients:", error);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    return { data, error, loading };
};

/**
 * Renderiza el estado de carga
 * @returns JSX Element de carga
 */
const LoadingState = () => (
    <div className="text-gray-500">Cargando clientes...</div>
);

/**
 * Renderiza el estado de error
 * @param error - Mensaje de error
 * @returns JSX Element de error
 */
const ErrorState = ({ error }: { error: string }) => (
    <div className="text-red-500">Error: {error}</div>
);

/**
 * Componente que muestra la sección de clientes de la empresa
 * Renderiza una grilla responsiva con los logos de los clientes
 */
const Clients = () => {
    const { data, error, loading } = useClients();

    if (error) {
        return <ErrorState error={error} />;
    }

    if (loading) {
        return <LoadingState />;
    }

    const validClients = data?.filter(isValidClient) || [];

    return (
        <div className="my-8">
            <h2 className="mb-4 font-bold text-2xl">Nuestros Clientes</h2>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {validClients.map(renderClient)}
            </div>
        </div>
    );
};

export default Clients;
