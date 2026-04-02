'use client';
import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {getProfileAction, logoutAction} from "@/features/auth/actions/auth.action";
import { UserDto} from "@/shared/api/api";

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserDto | null;
    setUser: (user: UserDto | null) => void;
    isLoading: boolean;
    login: () => void;
    logout: (redirectUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
    children,
    initialIsAuthenticated
}: {
    children: ReactNode;
    initialIsAuthenticated: boolean;
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
    const [user, setUser] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsAuthenticated(initialIsAuthenticated);

        const fetchUserProfile = async () => {
            if (initialIsAuthenticated) {
                try {
                    setIsLoading(true);
                    const response = await getProfileAction();
                    setUser(response.result);
                } catch (error) {
                    console.error("Không thể lấy thông tin user:", error);
                    setIsAuthenticated(false);
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUser(null);
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [initialIsAuthenticated]);

    useEffect(() => {
        setIsAuthenticated(initialIsAuthenticated);
    }, [initialIsAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
    }
    const logout = async (redirectUrl: string) => {
        setIsAuthenticated(false);
        await logoutAction();
        window.location.href = redirectUrl;
    }

    return (
      <AuthContext.Provider value={{ isAuthenticated, user, setUser, isLoading, login, logout }}>
          {children}
      </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được bọc bên trong AuthProvider');
    }
    return context;
}