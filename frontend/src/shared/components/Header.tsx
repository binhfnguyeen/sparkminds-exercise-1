'use client';

import Link from 'next/link';
import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from 'react';

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">

                {/* Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-600 transition-transform hover:scale-105">
                        Book<span className="text-gray-900">Book</span>
                    </Link>

                    <nav className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Trang chủ</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Khóa học</Link>
                        <Link href="#" className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600">Về chúng tôi</Link>
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Chào mừng bạn!</span>

                            {/* KHỐI CÀI ĐẶT (Đã bọc lại cẩn thận) */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsSettingsOpen(true)}
                                onMouseLeave={() => setIsSettingsOpen(false)}
                            >
                                {/* Nút bấm */}
                                <button className="flex items-center gap-1 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                    Cài đặt
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>

                                {/* BÍ QUYẾT Ở ĐÂY: Chỉ sinh ra Menu khi biến isSettingsOpen = true */}
                                {isSettingsOpen && (
                                    <div className="absolute right-0 top-full w-48 pt-2 z-50">
                                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Link href="/client/settings?tab=mfa" className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                                Bảo mật & MFA
                                            </Link>
                                            <Link href="/client/settings?tab=password" className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                                Đổi Mật Khẩu
                                            </Link>
                                            <Link href="/client/settings?tab=email" className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                                Đổi Email
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={logout}
                                className="px-5 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-200"
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