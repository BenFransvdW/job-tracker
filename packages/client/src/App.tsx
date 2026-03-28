import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useAuthContext } from './context/AuthContext';
import { initApiClient } from './api/client';
import { apiPost } from './api/client';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Placeholder until Phase 6 & 7 pages are implemented
function PlaceholderPage({ name }: { name: string }) {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-gray-500 mt-2">Coming soon...</p>
        </div>
    );
}

function ApiClientInitializer({ children }: { children: React.ReactNode }) {
    const { setAccessToken, getAccessToken } = useAuthContext();
    const { logout } = useAuth();

    useEffect(() => {
        const refresh = async (): Promise<string | null> => {
            try {
                const data = await apiPost<{ accessToken: string }>('/api/auth/refresh');
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
                        <Route path="/board" element={<PlaceholderPage name="Board" />} />
                        <Route path="/list" element={<PlaceholderPage name="List" />} />
                        <Route path="/dashboard" element={<PlaceholderPage name="Dashboard" />} />
                        <Route path="/applications/:id" element={<PlaceholderPage name="Application Detail" />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/board" replace />} />
                </Routes>
            </ApiClientInitializer>
        </BrowserRouter>
    );
}
