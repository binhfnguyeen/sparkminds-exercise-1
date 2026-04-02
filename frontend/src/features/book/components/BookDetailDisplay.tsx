'use client';

import React from 'react';
import { BookResponse } from '@/shared/types/book.types';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/features/auth/context/AuthContext";

interface BookDetailDisplayProps {
    book: BookResponse;
}

export const BookDetailDisplay: React.FC<BookDetailDisplayProps> = ({ book }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleBorrowBook = () => {
        if (!isAuthenticated) {
            const confirmLogin = window.confirm("Bạn cần đăng nhập để mượn sách. Đi đến trang đăng nhập ngay?");
            if (confirmLogin) {
                router.push('/client/login');
            }
            return;
        }
        alert(`Bạn đang yêu cầu mượn cuốn: "${book.title}". (Tính năng đang phát triển)`);
    };

    return (
        // Tăng chiều rộng lên max-w-7xl để có khoảng trống đẩy ảnh và chữ về 2 phía
        <div className="max-w-7xl mx-auto relative rounded-[2rem]">

            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row relative z-10 min-h-[600px]">

                {/* --- NỬA TRÁI --- */}
                {/* Dùng justify-start để ép ảnh nằm sát lề trái */}
                <div className="w-full md:w-1/2 flex items-center justify-start p-8 lg:p-10">
                    {/* Phóng to ảnh từ 400px lên 500px */}
                    <div className="relative group w-full max-w-[500px]">

                        {book.imgUrl ? (
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-500 scale-105"></div>
                                <img
                                    src={book.imgUrl}
                                    alt={book.title}
                                    className="
                                        relative w-full
                                        rounded-2xl
                                        shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                                        transition-all duration-500
                                        group-hover:-translate-y-3
                                        group-hover:scale-[1.04]
                                        object-cover aspect-[2/3]
                                    "
                                />
                            </div>
                        ) : (
                            <div className="w-full aspect-[2/3] bg-white/50 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-gray-400 shadow-sm">
                                <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                                    </path>
                                </svg>
                                <span className="text-base font-medium">Không có ảnh bìa</span>
                            </div>
                        )}

                        {book.quantity <= 0 && (
                            <div className="absolute top-4 right-4 bg-rose-100/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                                <span className="text-rose-600 text-sm font-semibold">
                                    Hết sách
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- NỬA PHẢI --- */}
                {/* Dùng lg:pl-24 để tạo khoảng cách lớn bên trái, đẩy khối nội dung dạt sang bên phải */}
                <div className="w-full md:w-1/2 p-8 lg:p-10 lg:pl-24 flex flex-col justify-center">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1.5 bg-blue-100/50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg mb-4 shadow-sm">
                            {book.category?.name || 'Chưa phân loại'}
                        </span>
                        <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            {book.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-4 text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            <p className="text-lg font-medium">{book.author}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Tình trạng</p>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${book.quantity > 0 ? 'bg-green-500' : 'bg-rose-500'}`}></div>
                                <p className={`text-base font-bold ${book.quantity > 0 ? 'text-gray-900' : 'text-rose-500'}`}>
                                    {book.quantity > 0 ? `Còn ${book.quantity} cuốn` : 'Đang hết sách'}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-sm">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Mã sách</p>
                            <p className="text-base font-bold text-gray-900 font-mono">
                                #Bookbook-{book?.id?.toString().padStart(4, '0') || '0000'}
                            </p>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-center">
                        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                            Giới thiệu nội dung
                        </h3>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap bg-white/40 backdrop-blur-md p-6 rounded-2xl max-h-[220px] overflow-y-auto custom-scrollbar shadow-sm">
                            {book.description || 'Nội dung mô tả cuốn sách đang được cập nhật...'}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-blue-100/50 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleBorrowBook}
                            disabled={book.quantity <= 0}
                            className="flex-1 px-8 py-4 bg-blue-600 text-white text-base font-bold rounded-xl hover:bg-blue-700 transition-all disabled:bg-blue-200 disabled:text-blue-400 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.98] flex justify-center items-center gap-2"
                        >
                            {isAuthenticated ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Mượn sách ngay
                                </>
                            ) : (
                                "Đăng nhập để mượn"
                            )}
                        </button>

                        <button
                            onClick={() => router.back()}
                            className="px-8 py-4 bg-white/80 backdrop-blur-md hover:bg-white text-gray-700 font-bold rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};