import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import { cookies } from "next/headers";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { MaintenanceScreen } from "@/features/maintenances/components/MaintenanceScreen";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

async function checkMaintenanceStatus() {
    try {
        const res = await fetch(`${API_URL}/categories`, {
            cache: 'no-store'
        });

        if (res.status === 503) {
            return true;
        }
        return false;
    } catch (error) {
        return true;
    }
}

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.has('accessToken');

    const isMaintenance = await checkMaintenanceStatus();

    if (isMaintenance) {
        return (
            <MaintenanceScreen />
        );
    }

    return (
        <AuthProvider initialIsAuthenticated={isAuthenticated}>
            <div className="flex flex-col min-h-screen">
                <Header/>

                <main className="flex-grow">
                    {children}
                </main>

                <Footer/>
            </div>
        </AuthProvider>
    );
}