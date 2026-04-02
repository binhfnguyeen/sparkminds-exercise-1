import { AuthProvider } from "@/features/auth/context/AuthContext";
import { cookies } from "next/headers";
import {AdminLayoutWrapper} from "@/features/auth/components/AdminLayoutWrapper";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();

    const isAuthenticated = cookieStore.has('adminAccessToken');

    return (
        <AuthProvider initialIsAuthenticated={isAuthenticated}>
            <AdminLayoutWrapper>
                {children}
            </AdminLayoutWrapper>
        </AuthProvider>
    );
}