import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser, validateToken } from '@/api/auth.ts';

interface StrapiMedia {
    id: number;
    url: string;
    name: string;
    alternativeText?: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    avatar?: StrapiMedia | number | string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Retrieves stored authentication token
 * @returns Stored token or null
 */
function getStoredToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Stores authentication token
 * @param token - Token to store
 */
function storeToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Removes stored authentication token
 */
function removeStoredToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Validates stored token and retrieves user data
 * @param token - Token to validate
 * @returns User data if valid, null otherwise
 */
async function validateAndGetUser(token: string): Promise<User | null> {
    try {
        const isValid = await validateToken(token);
        if (!isValid) {
            return null;
        }

        return await getCurrentUser(token);
    } catch (error) {
        console.error('Token validation failed:', error);
        return null;
    }
}

/**
 * Authentication provider component that manages user state
 * Handles token persistence and validation
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Initializes authentication state from localStorage
     * Validates stored token on app start
     */
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = getStoredToken();

            if (storedToken) {
                const userData = await validateAndGetUser(storedToken);

                if (userData) {
                    setToken(storedToken);
                    setUser(userData);
                } else {
                    removeStoredToken();
                }
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    /**
     * Logs in user and stores authentication data
     * @param authToken - Authentication token
     * @param userData - User data
     */
    const login = (authToken: string, userData: User): void => {
        storeToken(authToken);
        setToken(authToken);
        setUser(userData);
    };

    /**
     * Logs out user and clears authentication data
     */
    const logout = (): void => {
        removeStoredToken();
        setToken(null);
        setUser(null);
    };

    /**
     * Updates user data in context
     * @param userData - Updated user data
     */
    const updateUser = (userData: User): void => {
        setUser(userData);
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        logout,
        updateUser,
        isLoading,
        isAuthenticated: !!user && !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access authentication context
 * @returns Authentication context value
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
