const API_BASE = import.meta.env.VITE_API_URL ?? '';

let getTokenFn: (() => string | null) | null = null;
let refreshFn: (() => Promise<string | null>) | null = null;
let logoutFn: (() => void) | null = null;

export function initApiClient(
    getToken: () => string | null,
    refresh: () => Promise<string | null>,
    logout: () => void
) {
    getTokenFn = getToken;
    refreshFn = refresh;
    logoutFn = logout;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE}${path}`;
    const token = getTokenFn?.();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> ?? {})
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let res = await fetch(url, { ...options, headers, credentials: 'include' });

    if (res.status === 401 && refreshFn) {
        const newToken = await refreshFn();
        if (newToken) {
            headers['Authorization'] = `Bearer ${newToken}`;
            res = await fetch(url, { ...options, headers, credentials: 'include' });
        }
        if (res.status === 401) {
            logoutFn?.();
        }
    }

    return res;
}

export async function apiGet<T>(url: string): Promise<T> {
    const res = await apiFetch(url);
    if (!res.ok) throw await res.json();
    return res.json();
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
    const res = await apiFetch(url, { method: 'POST', body: JSON.stringify(body) });
    if (!res.ok) throw await res.json();
    return res.json();
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
    const res = await apiFetch(url, { method: 'PUT', body: JSON.stringify(body) });
    if (!res.ok) throw await res.json();
    return res.json();
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
    const res = await apiFetch(url, { method: 'PATCH', body: JSON.stringify(body) });
    if (!res.ok) throw await res.json();
    return res.json();
}

export async function apiDelete<T>(url: string): Promise<T> {
    const res = await apiFetch(url, { method: 'DELETE' });
    if (!res.ok) throw await res.json();
    return res.json();
}
