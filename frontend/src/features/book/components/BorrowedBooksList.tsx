'use client';

import React from 'react';
import { BorrowBookResponse } from '@/shared/types/book.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BorrowedBooksListProps {
    borrowedBooks: BorrowBookResponse[];
}

export const BorrowedBooksList: React.FC<BorrowedBooksListProps> = ({ borrowedBooks }) => {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sách Đã Mượn</h1>
                    <p className="text-gray-500 mt-2">Danh sách những cuốn sách bạn đang theo dõi và mượn đọc.</p>
                </div>
                <button
                    onClick={() => router.push('/client')}
                    className="px-6 py-2.5 bg-white/80 backdrop-blur-md text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm whitespace-nowrap"
                >
                    Khám phá thêm
                </button>
            </div>

            {borrowedBooks.length === 0 ? (
                <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[2rem] shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Chưa có sách nào</h3>
                    <p className="text-gray-500">Bạn chưa mượn cuốn sách nào. Hãy tìm và mượn ngay nhé!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {borrowedBooks.map((item) => (
                        <div key={item.borrowId} className={`group flex flex-col backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 
                        ${item.isOverDue ? 'bg-red-50/80 border border-red-100 hover:shadow-red-900/10' : 'bg-white/70 border border-gray-100 hover:shadow-blue-900/5'}`}>
                            <Link href="#">
                                <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100 relative">
                                    <img
                                        src={item.imgUrl || '/file.svg'}
                                        alt={item.title}
                                        onError={(e) => { e.currentTarget.src = '/file.svg'; }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />

                                    {/* Nhãn góc trên trái */}
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                                        {item.isOverDue ? (
                                            <span className="text-red-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                Quá hạn
                                            </span>
                                        ) : (
                                            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                Đang mượn
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-extrabold text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors" title={item.title}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4 font-medium">{item.author}</p>
                                <div className="mt-auto pt-4 border-t border-gray-100/80">
                                    <div className="flex flex-col gap-2.5">
                                        {/* Ngày mượn */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                                                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                Ngày mượn
                                            </span>
                                            <span className="font-bold text-gray-700 bg-gray-100/80 px-2 py-0.5 rounded-md">
                                                {new Date(item.borrowedAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>

                                        {/* Hạn trả */}
                                        {item.dueDate && (
                                            <div className="flex items-center justify-between text-xs">
                                                <span className={`${item.isOverDue ? 'text-red-500' : 'text-gray-500'} flex items-center gap-1.5 font-medium`}>
                                                    <svg className={`w-4 h-4 ${item.isOverDue ? 'text-red-500' : 'text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    Hạn trả
                                                </span>
                                                <span className={`font-bold px-2 py-0.5 rounded-md ${item.isOverDue ? 'text-red-600 bg-red-100' : 'text-emerald-600 bg-emerald-50'}`}>
                                                    {new Date(item.dueDate).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};