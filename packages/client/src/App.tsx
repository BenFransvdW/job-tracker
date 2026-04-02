import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useAuthContext } from './context/AuthContext';
import { initApiClient } from './api/client';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BoardPage } from './pages/BoardPage';
import { ListPage } from './pages/ListPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { DashboardPage } from './pages/DashboardPage';

function ApiClientInitializer({ children }: { children: React.ReactNode }) {
    const { setAccessToken, getAccessToken } = useAuthContext();
    const { logout } = useAuth();

    useEffect(() => {
        const refresh = async (): Promise<string | null> => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) return null;
                const data = await res.json();
                setAccessToken(data.accessToken);
                return data.accessToken;
            } catch {
                return null;
            }
        };

        initApiClient(getAccessToken, refresh, logout);
    }, [getAccessToken, setAccessToken, logout]);

    return <>{children}</>;
}

function RequireAuth() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
}

export default function App() {
    return (
        <BrowserRouter>
            <ApiClientInitializer>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<RequireAuth />}>
                        <Route path="/board" element={<BoardPage />} />
                        <Route path="/list" element={<ListPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/applications/:id" element={<ApplicationDetailPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/board" replace />} />
                </Routes>
            </ApiClientInitializer>
        </BrowserRouter>
    );
}
