'use client';
import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {logoutAction} from "@/features/auth/actions/auth.action";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => Promise<void>
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

    useEffect(() => {
        setIsAuthenticated(initialIsAuthenticated);
    }, [initialIsAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
    }
    const logout = async () => {
        setIsAuthenticated(false);
        await logoutAction();
        window.location.href = '/client/login'
    }

    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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