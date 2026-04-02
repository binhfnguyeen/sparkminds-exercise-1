'use client';

import { useState } from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useAuth} from "@/features/auth/context/AuthContext";

export const AdminSidebar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout} = useAuth();

    const menuItems = [
        {
            name: 'Quản lý Sách',
            path: '/admin/books',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            )
        },
        {
            name: 'Quản lý Thành viên',
            path: '/admin/members',
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            )
        },
    ];

    return (
        <aside className="bg-white border-r border-gray-200 fixed inset-y-0 left-0 w-64 z-30 flex flex-col shadow-sm">
            <div className="px-5 py-6 flex flex-col gap-6 flex-1 overflow-y-auto">
                <div className="flex items-center gap-3">
                    <Link href="/client/" className="text-2xl font-extrabold tracking-tight text-blue-600 transition-transform hover:scale-105">
                        Book<span className="text-gray-900">Book</span>
                    </Link>
                </div>
                <nav className="flex flex-col gap-1.5 mt-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Chức năng</div>

                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 pb-6 border-t border-gray-100 flex flex-col gap-3 bg-gray-50/50 shrink-0">
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className={`flex items-center justify-between w-full p-2 rounded-xl transition-all text-left border ${isProfileOpen ? 'bg-white shadow-sm border-gray-200' : 'hover:bg-white hover:shadow-sm border-transparent hover:border-gray-200'}`}
                    >
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                                {user ? `${user.firstName || ''} ${user.lastName || 'Admin'}`.trim() : 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-500 font-medium truncate">
                                {user?.email || 'Quản trị viên'}
                            </p>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isProfileOpen ? '-rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    </button>
                    {isProfileOpen && (
                        <div className="absolute left-full bottom-0 ml-4 w-60 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-left-2 z-50">
                            <div className="absolute -left-2 bottom-5 w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45"></div>
                            <div className="relative z-10 bg-white rounded-2xl">

                                <Link href="/admin/settings?tab=password" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Cài đặt
                                </Link>

                                <hr className="my-1 border-gray-100" />
                                <button
                                    onClick={() => logout('/admin/login')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors rounded-b-2xl"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                        />
                                    </svg>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};