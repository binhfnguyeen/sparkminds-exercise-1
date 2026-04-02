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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sách Đã Mượn</h1>
                    <p className="text-gray-500 mt-2">Danh sách những cuốn sách bạn đang theo dõi và mượn đọc.</p>
                </div>
                <button
                    onClick={() => router.push('/client')}
                    className="px-6 py-2.5 bg-white/80 backdrop-blur-md text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {borrowedBooks.map((item) => (
                        <div key={item.borrowId} className="group flex flex-col bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1.5">
                            <Link href={`/client/books/${item.bookId}`}>
                                <div className="aspect-[2/3] w-full overflow-hidden bg-blue-50/50 relative">
                                    <img
                                        src={item.imgUrl || '/file.svg'}
                                        alt={item.title}
                                        onError={(e) => { e.currentTarget.src = '/file.svg'; }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                                        <span className="text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                                            Đang mượn
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-extrabold text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors" title={item.title}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2 font-medium">{item.author}</p>

                                <p className="text-xs text-gray-400 mb-3">
                                    Mượn: {new Date(item.borrowedAt).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};