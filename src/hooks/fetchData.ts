import { apiGet } from '@/api/config';

interface SuspenderResult<T> {
    read: () => T;
}

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

/**
 * Crea un suspender para React Suspense
 * @param promise - Promise a suspender
 * @returns Objeto con método read para Suspense
 */
const getSuspender = <T>(promise: Promise<T>): SuspenderResult<T> => {
    let status: "pending" | "success" | "error" = "pending";
    let response: T;

    const suspender = promise.then(
        (res) => {
            status = "success";
            response = res;
        },
        (err) => {
            status = "error";
            response = err;
        }
    );

    const read = (): T => {
        switch (status) {
            case "pending":
                throw suspender;
            case "error":
                console.error("Fetch error:", response);
                return { data: [] } as unknown as T; // Return empty data structure on error
            default:
                return response;
        }
    };

    return { read };
};

/**
 * Hook para fetch de datos con Suspense
 * Utiliza la configuración centralizada de la API
 * @param url - Endpoint de la API (relativo, ej: '/api/products')
 * @returns Suspender con los datos de la API
 */
export function fetchData<T = any>(url: string): SuspenderResult<ApiResponse<T>> {
    try {
        const promise = apiGet(url)
            .then((data) => data as ApiResponse<T>)
            .catch((error) => {
                console.error("Fetch error:", error.message);
                // Return empty data structure on error to prevent crashes
                return { data: [] } as ApiResponse<T>;
            });

        return getSuspender(promise);
    } catch (error) {
        console.error("Error fetching data:", error);
        // Return suspender with empty data structure
        return getSuspender(Promise.resolve({ data: [] } as ApiResponse<T>));
    }
}
