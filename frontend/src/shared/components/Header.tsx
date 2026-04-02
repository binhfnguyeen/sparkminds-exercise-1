'use client';

import Link from 'next/link';
import { useAuth } from "@/features/auth/context/AuthContext";

export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm backdrop-blur-md">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex items-center gap-8">
                    <Link href="/client" className="text-2xl font-extrabold tracking-tight text-blue-600 transition-transform hover:scale-105">
                        Book<span className="text-gray-900">Book</span>
                    </Link>

                    <nav className="hidden md:flex gap-6">
                        <Link href="/client" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Trang chủ</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Mượn sách</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Trả sách</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4 h-full">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4 h-full">
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Chào mừng {user?.lastName} <span className="font-bold">{user?.firstName}</span> !</span>

                            <Link
                                href="/client/settings?tab=mfa"
                                className="flex items-center gap-1.5 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </Link>

                            <button
                                onClick={() => logout('/client/login')}
                                className="px-5 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/client/register" className="px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:text-blue-600">Đăng ký</Link>
                            <Link href="/client/login" className="px-5 py-2 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Đăng nhập</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}