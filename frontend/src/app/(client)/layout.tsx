import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import {cookies} from "next/headers";
import {AuthProvider} from "@/features/auth/context/AuthContext";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.has('accessToken');
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
    )
}