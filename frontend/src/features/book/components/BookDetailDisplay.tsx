'use client';

import React, { useEffect, useState } from 'react';
import { BookResponse } from '@/shared/types/book.types';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/features/auth/context/AuthContext";
import { borrowBookAction, getBorrowedBooksAction } from "@/features/book/actions/book.action";

interface BookDetailDisplayProps {
    book: BookResponse;
}

export const BookDetailDisplay: React.FC<BookDetailDisplayProps> = ({ book }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [borrowStatus, setBorrowStatus] = useState<'IDLE' | 'PENDING' | 'BORROWED'>('IDLE');
    const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);

    useEffect(() => {
        const checkBorrowStatus = async () => {
            if (!isAuthenticated) {
                setIsCheckingStatus(false);
                return;
            }

            try {
                const response = await getBorrowedBooksAction();
                if (response.code === 1000 && response.result) {
                    const existingRecord = response.result.find(
                        (record) => record.bookId === book.id &&
                            (record.status === 'PENDING' || record.status === 'BORROWED')
                    );

                    if (existingRecord) {
                        setBorrowStatus(existingRecord.status as 'PENDING' | 'BORROWED');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra trạng thái mượn:', error);
            } finally {
                setIsCheckingStatus(false);
            }
        };

        checkBorrowStatus();
    }, [book.id, isAuthenticated]);

    const handleConfirmBorrow = async () => {
        setIsSubmitting(true);
        try {
            await borrowBookAction(book.id);
            alert('Gửi yêu cầu mượn sách thành công! Vui lòng chờ Admin phê duyệt.');
            setBorrowStatus('PENDING');
            setIsModalOpen(false);
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Có lỗi xảy ra khi mượn sách.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderActionButton = () => {
        if (!isAuthenticated) {
            return (
                <button
                    onClick={() => router.push('/client/login')}
                    className="flex-1 px-8 py-4 bg-white text-gray-900 text-base font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                    Đăng nhập để mượn
                </button>
            );
        }

        if (isCheckingStatus) {
            return (
                <button disabled className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl cursor-not-allowed flex justify-center items-center">
                    <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                    Đang kiểm tra...
                </button>
            );
        }

        if (borrowStatus === 'PENDING') {
            return (
                <button disabled className="flex-1 px-8 py-4 bg-amber-50 text-amber-600 border border-amber-200 font-bold rounded-xl cursor-not-allowed flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Đang chờ duyệt
                </button>
            );
        }

        if (borrowStatus === 'BORROWED') {
            return (
                <button disabled className="flex-1 px-8 py-4 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold rounded-xl cursor-not-allowed flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Đã mượn
                </button>
            );
        }

        if (book.quantity <= 0) {
            return (
                <button disabled className="flex-1 px-8 py-4 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed flex justify-center items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                    Hết sách
                </button>
            );
        }

        return (
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 px-8 py-4 bg-blue-600 text-white text-base font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-[0.98] flex justify-center items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Mượn sách ngay
            </button>
        );
    };

    return (
        <div className="max-w-7xl mx-auto relative rounded-[2rem]">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row relative z-10 min-h-[600px]">
                <div className="w-full md:w-1/2 flex items-center justify-start p-8 lg:p-10">
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
                                    onError={(e) => { e.currentTarget.src = '/file.svg'; }}
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
                        {renderActionButton()}

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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-6
                bg-gray-900/40 backdrop-blur-sm transition-all duration-300">

                    <div className="relative w-full max-w-md bg-white rounded-[2rem]
                        shadow-2xl shadow-black/10 border border-gray-100
                        animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-gray-50">
                            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                Xác nhận mượn sách
                            </h3>
                            <button
                                disabled={isSubmitting}
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 -mr-2 flex items-center justify-center rounded-full
                                text-gray-400 hover:text-gray-600 hover:bg-gray-100
                                transition-colors focus:outline-none disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex gap-4 mb-6 p-4 rounded-2xl bg-gray-50/80 border border-gray-100/80 group">
                                <div className="relative shrink-0">
                                    <img
                                        src={book.imgUrl || '/file.svg'}
                                        alt={book.title}
                                        className="w-14 h-20 object-cover rounded-lg shadow-sm bg-white"
                                        onError={(e) => { e.currentTarget.src = '/file.svg'; }}
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="font-bold text-gray-900 leading-snug line-clamp-2">
                                        {book.title}
                                    </p>
                                    <p className="text-sm font-medium text-blue-600 mt-1">
                                        {book.author}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Bạn có chắc chắn muốn mượn cuốn sách này không?
                                <span className="block mt-1 font-medium text-gray-500">Yêu cầu của bạn sẽ được gửi đến Admin để phê duyệt</span>
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 bg-gray-50/50 border-gray-50">
                            <button
                                disabled={isSubmitting}
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600
                                hover:text-gray-900 hover:bg-gray-200/50 transition-colors
                                focus:outline-none disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>

                            <button
                                disabled={isSubmitting}
                                onClick={handleConfirmBorrow}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5
                                rounded-xl text-sm font-bold text-white bg-blue-600
                                hover:bg-blue-700 active:scale-[0.98]
                                shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30
                                transition-all focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none" />
                                            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Đang xử lý
                                    </>
                                ) : (
                                    'Xác nhận mượn'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};