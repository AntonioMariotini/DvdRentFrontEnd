const VITE_API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> =>{
    const response = await fetch(`${VITE_API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    return response.json();
};