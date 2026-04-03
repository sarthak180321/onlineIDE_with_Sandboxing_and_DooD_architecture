const BASE_URL = '/api';

// const getHeaders = (): HeadersInit => {
//     const token = localStorage.getItem('token');
//     return {
//         'Content-Type': 'application/json',
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
// };
const getHeaders=():HeadersInit=>{
    const token=localStorage.getItem('token');
    return {
        'content-type':'application/json',
        ...(token?{Authorization:`Bearer ${token}`}:{}),
    }
};

export const api = {
    get: async (path: string): Promise<any> => {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message);
        }
        return res.json();
    },

    post: async (path: string, body?: object): Promise<any> => {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message);
        }
        return res.json();
    },

    delete: async (path: string): Promise<any> => {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message);
        }
        return res.json();
    },
};