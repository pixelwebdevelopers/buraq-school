import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app to provide authentication state.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService
                .getProfile()
                .then((res) => setUser(res.data.user))
                .catch((err) => {
                    // Only clear token if the server explicitly says it's invalid/expired (401)
                    // Do NOT clear on network errors or server downtime
                    if (err.response && err.response.status === 401) {
                        console.warn('[AUTH] Token invalid or expired, clearing session.');
                        localStorage.removeItem('token');
                        setUser(null);
                    } else {
                        console.error('[AUTH] Failed to fetch profile during initialization:', err.message);
                        // We keep the token and loading state might be handled by the component
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        return response;
    };

    const logout = async () => {
        await authService.logout();
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        setUser,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — hook to access auth context.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
