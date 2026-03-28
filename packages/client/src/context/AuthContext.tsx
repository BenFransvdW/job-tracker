import { createContext, useContext, useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@job-tracker/shared';

interface AuthContextValue {
    user: User | null;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const accessTokenRef = useRef<string | null>(null);
    const [, forceUpdate] = useState(0);

    const setAccessToken = (token: string | null) => {
        accessTokenRef.current = token;
        forceUpdate(n => n + 1);
    };

    useEffect(() => {
        // Try to restore session from httpOnly cookie
        fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.accessToken) {
                    setAccessToken(data.accessToken);
                    return fetch('/api/auth/me', {
                        headers: { Authorization: `Bearer ${data.accessToken}` },
                        credentials: 'include'
                    });
                }
                return null;
            })
            .then(res => res?.ok ? res.json() : null)
            .then(data => {
                if (data?.user) setUser(data.user);
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            accessToken: accessTokenRef.current,
            setAccessToken,
            setUser,
            isLoading,
            getAccessToken: () => accessTokenRef.current,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
    return ctx;
}
