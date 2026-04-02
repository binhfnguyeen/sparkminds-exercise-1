'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from "@/shared/components/AdminSidebar";

export const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isLoginPage = pathname.includes('/login');

    if (isLoginPage) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                {children}
            </main>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex flex-col flex-1 ml-64">
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};