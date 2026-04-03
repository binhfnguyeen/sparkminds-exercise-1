// frontend/src/features/book/components/AdminBorrowManagement.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BorrowBookResponse } from '@/shared/types/book.types';
import {
    searchBorrowRecordsAdminAction,
    approveBorrowRequestAction,
    rejectBorrowRequestAction,
    returnBookAction
} from "@/features/book/actions/book.action";

export const AdminBorrowManagement = () => {
    const [requests, setRequests] = useState<BorrowBookResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filters
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<string>(''); // Rỗng = Tất cả
    const [appliedFilters, setAppliedFilters] = useState({ email: '', title: '', status: '' });

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await searchBorrowRecordsAdminAction({
                page,
                size: 10,
                email: appliedFilters.email,
                title: appliedFilters.title,
                status: appliedFilters.status || undefined,
            });
            if (res.code === 1000) {
                setRequests(res.result.content);
                setTotalPages(res.result.totalPages);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách mượn sách:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, appliedFilters]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setAppliedFilters({ email, title, status });
    };

    const handleClearFilter = () => {
        setEmail('');
        setTitle('');
        setStatus('');
        setPage(0);
        setAppliedFilters({ email: '', title: '', status: '' });
    };

    // CÁC HÀM XỬ LÝ ACTION (Sau khi gọi xong thì fetchRequests để làm mới bảng)
    const handleApprove = async (borrowId: number) => {
        if (!confirm('Xác nhận duyệt yêu cầu mượn sách này?')) return;
        try {
            await approveBorrowRequestAction(borrowId);
            fetchRequests();
        } catch (error: any) { alert(error.message); }
    };

    const handleReject = async (borrowId: number) => {
        if (!confirm('Từ chối yêu cầu mượn sách này?')) return;
        try {
            await rejectBorrowRequestAction(borrowId);
            fetchRequests();
        } catch (error: any) { alert(error.message); }
    };

    const handleReturn = async (borrowId: number) => {
        if (!confirm('Xác nhận thành viên đã trả cuốn sách này?')) return;
        try {
            await returnBookAction(borrowId);
            fetchRequests();
        } catch (error: any) { alert(error.message); }
    };

    // RENDER STATUS BADGE
    const renderStatusBadge = (statusStr: string) => {
        switch (statusStr) {
            case 'PENDING': return <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md text-xs font-bold">Chờ duyệt</span>;
            case 'BORROWED': return <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs font-bold">Đang mượn</span>;
            case 'RETURNED': return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-md text-xs font-bold">Đã trả</span>;
            case 'REJECTED': return <span className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-xs font-bold">Từ chối</span>;
            default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">{statusStr}</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Quản lý Mượn sách</h1>
                <p className="text-gray-500 mt-2">Tìm kiếm, lọc trạng thái và xét duyệt các yêu cầu mượn sách của hệ thống.</p>
            </div>

            {/* FORM TÌM KIẾM VÀ LỌC */}
            <form onSubmit={handleSearch} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Người Mượn</label>
                    <input
                        type="text"
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="Nhập email..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên sách</label>
                    <input
                        type="text"
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="Nhập tên sách..."
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    />
                </div>
                <div className="w-full md:w-48 shrink-0">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Trạng thái</label>
                    <select
                        value={status} onChange={e => setStatus(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-sm font-medium"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="BORROWED">Đang mượn</option>
                        <option value="RETURNED">Đã trả</option>
                        <option value="REJECTED">Từ chối</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition">
                        Tìm kiếm
                    </button>
                    {(appliedFilters.email || appliedFilters.title || appliedFilters.status) && (
                        <button type="button" onClick={handleClearFilter} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition">
                            Hủy lọc
                        </button>
                    )}
                </div>
            </form>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8 border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="px-6 py-4 font-bold">Người mượn</th>
                            <th className="px-6 py-4 font-bold">Thông tin sách</th>
                            <th className="px-6 py-4 font-bold">Ngày yêu cầu</th>
                            <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                            <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">Đang tải dữ liệu...</td>
                            </tr>
                        ) : requests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    Không tìm thấy yêu cầu mượn sách nào.
                                </td>
                            </tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.borrowId} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                {req.userEmail?.charAt(0) || 'U'}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm truncate max-w-[200px]" title={req.userEmail}>{req.userEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={req.imgUrl || '/file.svg'} alt="" className="w-10 h-14 object-cover rounded-md shadow-sm shrink-0 border border-gray-100" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm line-clamp-1">{req.title}</span>
                                                <span className="text-xs text-gray-500 mt-0.5 font-medium">{req.author}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-600">
                                                {new Date(req.borrowedAt).toLocaleDateString('vi-VN')}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {renderStatusBadge(req.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">

                                            {/* NÚT XỬ LÝ THEO TRẠNG THÁI */}
                                            {req.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => handleApprove(req.borrowId)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                                        Duyệt
                                                    </button>
                                                    <button onClick={() => handleReject(req.borrowId)} className="px-3 py-1.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                                        Từ chối
                                                    </button>
                                                </>
                                            )}

                                            {req.status === 'BORROWED' && (
                                                <button onClick={() => handleReturn(req.borrowId)} className="px-4 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs rounded-lg transition-all shadow-sm">
                                                    Thu hồi sách
                                                </button>
                                            )}

                                            {(req.status === 'RETURNED' || req.status === 'REJECTED') && (
                                                <span className="text-xs text-gray-400 italic">Không có thao tác</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-3">
                    <button
                        disabled={page === 0}
                        onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-4 py-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-xl disabled:opacity-50 text-sm font-bold transition-all text-gray-600 shadow-sm flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        Trang trước
                    </button>
                    <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 font-bold bg-gray-100 rounded-xl">
                        <span>Trang</span>
                        <span className="text-blue-600">{page + 1}</span>
                        <span>/ {totalPages}</span>
                    </div>
                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="px-4 py-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-xl disabled:opacity-50 text-sm font-bold transition-all text-gray-600 shadow-sm flex items-center gap-1.5"
                    >
                        Trang sau
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            )}
        </div>
    );
};