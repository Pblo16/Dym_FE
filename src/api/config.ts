/**
 * Configuración centralizada de la API
 * Maneja las URLs base y headers para todas las requests
 */

// Configuración base de la API
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
    token: import.meta.env.VITE_STRAPI_TOKEN,
    timeout: 10000, // 10 segundos
};

/**
 * Headers por defecto para las requests
 */
export const getDefaultHeaders = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(API_CONFIG.token && { 'Authorization': `Bearer ${API_CONFIG.token}` }),
});

/**
 * Construye URL completa para endpoints de la API
 * @param {string} endpoint - Endpoint de la API (ej: '/api/products')
 * @returns {string} URL completa
 */
export const buildApiUrl = (endpoint: string): string => {
    const baseURL = API_CONFIG.baseURL.endsWith('/')
        ? API_CONFIG.baseURL.slice(0, -1)
        : API_CONFIG.baseURL;

    const path = endpoint.startsWith('/')
        ? endpoint
        : `/${endpoint}`;

    return `${baseURL}${path}`;
};

/**
 * Wrapper para fetch con configuración por defecto
 * @param {string} endpoint - Endpoint de la API
 * @param {RequestInit} options - Opciones adicionales para fetch
 * @returns {Promise<Response>} Response de fetch
 */
export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
        const url = buildApiUrl(endpoint);
        const response = await fetch(url, {
            signal: controller.signal,
            ...options,
            headers: {
                ...getDefaultHeaders(),
                ...(options.headers || {}),
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout - Verifique su conexión a internet');
        }
        throw error;
    }
};

/**
 * Helper para requests GET con parsing JSON automático
 * @param {string} endpoint - Endpoint de la API
 * @param {RequestInit} options - Opciones adicionales
 * @returns {Promise<any>} Datos parseados de la response
 */
export const apiGet = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const response = await apiRequest(endpoint, { method: 'GET', ...options });
    return response.json();
};

/**
 * Helper para requests POST con parsing JSON automático
 * @param {string} endpoint - Endpoint de la API
 * @param {any} data - Datos a enviar
 * @param {RequestInit} options - Opciones adicionales
 * @returns {Promise<any>} Datos parseados de la response
 */
export const apiPost = async (endpoint: string, data: any, options: RequestInit = {}): Promise<any> => {
    const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
    });
    return response.json();
};

/**
 * Helper para requests PUT con parsing JSON automático
 * @param {string} endpoint - Endpoint de la API
 * @param {any} data - Datos a enviar
 * @param {RequestInit} options - Opciones adicionales
 * @returns {Promise<any>} Datos parseados de la response
 */
export const apiPut = async (endpoint: string, data: any, options: RequestInit = {}): Promise<any> => {
    const response = await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options,
    });
    return response.json();
};

/**
 * Helper para requests DELETE
 * @param {string} endpoint - Endpoint de la API
 * @param {RequestInit} options - Opciones adicionales
 * @returns {Promise<any>} Datos parseados de la response
 */
export const apiDelete = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const response = await apiRequest(endpoint, { method: 'DELETE', ...options });
    return response.json();
};
