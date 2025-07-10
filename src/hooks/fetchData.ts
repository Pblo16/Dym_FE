interface SuspenderResult<T> {
    read: () => T;
}

interface ApiResponse<T = any> {
    data: T;
    [key: string]: any;
}

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
                return [] as unknown as T; // Return empty array on error
            default:
                return response;
        }
    };

    return { read };
};

export function fetchData<T = any>(url: string): SuspenderResult<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const baseUrl = import.meta.env.VITE_STRAPI_URL as string;
    const urlComplete = baseUrl + url;
    try {
        const promise = fetch(urlComplete, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
            },
        })
            .then((response) => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json() as Promise<ApiResponse<T>>;
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                console.error("Fetch error:", error.message);
                return [] as unknown as ApiResponse<T>; // Return empty array on error
            });

        return getSuspender(promise);
    } catch (error) {
        console.error("Error fetching data:", error);
        return getSuspender(Promise.resolve([] as unknown as ApiResponse<T>)); // Return suspender with empty array
    }
}
