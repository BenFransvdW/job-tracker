import { useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { apiPost } from '../api/client';

export function useAuth() {
    const { user, accessToken, setAccessToken, setUser, isLoading } = useAuthContext();

    const login = useCallback(async (email: string, password: string) => {
        const data = await apiPost<{ accessToken: string; user: any }>('/api/auth/login', { email, password });
        setAccessToken(data.accessToken);
        setUser(data.user);
        return data;
    }, [setAccessToken, setUser]);

    const logout = useCallback(async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        } catch {}
        setAccessToken(null);
        setUser(null);
    }, [setAccessToken, setUser]);

    return {
        user,
        isLoading,
        isAuthenticated: !!accessToken && !!user,
        login,
        logout,
    };
}
