import {AdminLoginForm} from "@/features/auth/components/AdminLoginForm";
import Link from "next/link";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <Link href="/client" className="text-2xl font-extrabold tracking-tight text-blue-600 transition-transform hover:scale-105">
                    Book<span className="text-gray-900">Book</span>
                </Link>
            </div>

            <AdminLoginForm />

            <p className="mt-10 text-center text-sm text-slate-400 font-medium">
                &copy; {new Date().getFullYear()}. Chỉ dành cho nhân sự nội bộ.
            </p>
        </div>
    );
}