import {AdminHeader} from "@/shared/components/AdminHeader";
import {AdminFooter} from "@/shared/components/AdminFooter";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <AdminHeader />

            <div className="flex flex-col flex-1 ml-64">

                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>

                <AdminFooter />
            </div>
        </div>
    );
}