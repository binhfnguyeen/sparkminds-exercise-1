'use client';
import {createContext, type ReactNode, useContext, useState} from "react";
import {logoutAction} from "@/features/auth/actions/auth.action";

interface AuthContextType {
    isAuthenticated: boolean;
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

    const logout = async () => {
        setIsAuthenticated(true);
        await logoutAction();
    }

    return (
      <AuthContext.Provider value={{ isAuthenticated, logout }}>
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