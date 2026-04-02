'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookResponse, CategoryResponse } from '@/shared/types/book.types';
import {borrowBookAction, getAllCategoriesAction, searchBooksAction} from '@/features/book/actions/book.action';
import { useAuth } from "@/features/auth/context/AuthContext";
import Link from "next/link";

export default function ClientHomePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [books, setBooks] = useState<BookResponse[]>([]);

    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [keyword, setKeyword] = useState('');
    const [appliedKeyword, setAppliedKeyword] = useState('');

    const [isBorrowing, setIsBorrowing] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategoriesAction();
                if (res.code === 1000) {
                    setCategories(res.result);
                }
            } catch (error) {
                console.error("Lỗi lấy danh mục", error);
            }
        };
        fetchCategories();
    }, []);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size: 10,
                sortBy: 'id',
                sortDir: 'DESC',
                categoryId: activeCategoryId || undefined,
                keyword: appliedKeyword || undefined
            };
            const res = await searchBooksAction(params);
            if (res.code === 1000) {
                setBooks(res.result.content);
                setTotalPages(res.result.totalPages);
            }
        } catch (error) {
            console.error("Lỗi lấy sách", error);
        } finally {
            setLoading(false);
        }
    }, [activeCategoryId, page, appliedKeyword]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleCategoryChange = (categoryId: number | null) => {
        setActiveCategoryId(categoryId);
        setPage(0);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAppliedKeyword(keyword.trim());
        setPage(0);
    };

    const handleClearSearch = () => {
        setKeyword('');
        setAppliedKeyword('');
        setPage(0);
    };

    const handleBorrowBook = async (bookId: number) => {
        if (!isAuthenticated) {
            const confirmLogin = window.confirm("Bạn cần đăng nhập để mượn sách. Đi đến trang đăng nhập ngay?");
            if (confirmLogin) {
                router.push('/client/login');
            }
            return;
        }

        try {
            setIsBorrowing(true);
            const res = await borrowBookAction(bookId);
            if (res.code === 1000) {
                alert(`Chúc mừng! Bạn đã mượn thành công cuốn: "${bookId}".`);
                router.push('/client/borrowed-books');
            } else {
                alert(res.message || "Không thể mượn sách lúc này.");
            }
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra trong quá trình mượn sách.");
        } finally {
            setIsBorrowing(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50/30 pb-12">
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-8 md:p-12 mb-8 border border-gray-100 shadow-md shadow-blue-100/40 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-10"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl opacity-10"></div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight relative z-10">
                        BOOK<span className="text-blue-600">BOOK</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto relative z-10">
                        Khám phá kho tàng tri thức vô tận. Tìm kiếm, lựa chọn và mượn những cuốn sách yêu thích của bạn một cách dễ dàng và nhanh chóng.
                    </p>
                </div>

                <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm rounded-2xl p-4 mb-8 flex flex-col lg:flex-row lg:items-center gap-4 transition-all">

                    <form onSubmit={handleSearchSubmit} className="flex gap-2 shrink-0 lg:w-96">
                        <div className="flex items-center w-full max-w-xl bg-gray-100 rounded-xl p-1 shadow-sm focus-within:bg-white focus-within:shadow-md transition-all">

                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm kiếm sách, tác giả..."
                                className="flex-1 px-4 py-2.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            />

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </button>
                        </div>

                        {appliedKeyword && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="px-4 py-2.5 bg-rose-50 text-rose-500 font-semibold rounded-xl hover:bg-rose-100 transition text-sm"
                                title="Xóa tìm kiếm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        )}
                    </form>

                    <div className="hidden lg:block w-px h-10 bg-gray-200 mx-2"></div>

                    <div className="flex overflow-x-auto gap-2.5 no-scrollbar flex-1 pb-1 lg:pb-0 items-center">
                        <button
                            onClick={() => handleCategoryChange(null)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border
                                ${activeCategoryId === null
                                ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                            Tất cả sách
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border
                                    ${activeCategoryId === cat.id
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-[4px] border-gray-200 border-t-blue-600"></div>
                        <p className="text-gray-500 font-medium">Đang tải dữ liệu sách...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Không tìm thấy sách</h3>
                        <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác nhé.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {books.map(book => (
                                <div key={book.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 border border-gray-100 hover:-translate-y-1.5">
                                    <Link href={`/client/books/${book.id}`}>
                                        <div className="aspect-[2/3] w-full overflow-hidden bg-gray-100 relative">
                                            <img
                                                src={book.imgUrl || '/file.svg'}
                                                alt={book.title}
                                                onError={(e) => { e.currentTarget.src = '/file.svg'; }}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {book.quantity <= 0 && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                                    <span className="bg-rose-500 text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                                                        Hết sách
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <div className="p-5 flex flex-col flex-1 relative bg-white">
                                        <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3 w-fit">
                                            {book.category?.name || 'Chưa phân loại'}
                                        </span>
                                        <h3 className="font-extrabold text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors" title={book.title}>
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4 font-medium">{book.author}</p>

                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <button
                                                onClick={ isAuthenticated ? (() => handleBorrowBook(book.id)) : (() => router.push(`/client/login`))}
                                                disabled={book.quantity <= 0 }
                                                className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 flex justify-center items-center gap-2"
                                            >
                                                { isAuthenticated ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                                        Mượn sách
                                                    </>
                                                ) : "Đăng nhập để mượn" }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-12 mb-8">
                                <button
                                    disabled={page === 0}
                                    onClick={() => {
                                        setPage(p => p - 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-xl disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:cursor-not-allowed text-sm font-bold transition-all text-gray-700 shadow-sm flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                                    Trước
                                </button>

                                <div className="flex items-center gap-2 px-5 py-2.5 text-sm text-gray-700 font-bold bg-gray-100 rounded-xl">
                                    <span className="text-gray-400">Trang</span>
                                    <span>{page + 1} / {totalPages}</span>
                                </div>

                                <button
                                    disabled={page >= totalPages - 1}
                                    onClick={() => {
                                        setPage(p => p + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 rounded-xl disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:cursor-not-allowed text-sm font-bold transition-all text-gray-700 shadow-sm flex items-center gap-2"
                                >
                                    Sau
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}