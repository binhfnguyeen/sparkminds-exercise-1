'use client';

import React, { useState } from 'react';
import { BorrowBookResponse } from '@/shared/types/book.types';
import { approveBorrowRequestAction, rejectBorrowRequestAction } from "@/features/book/actions/book.action";

interface AdminBorrowManagementProps {
    initialData: BorrowBookResponse[];
}

export const AdminBorrowManagement: React.FC<AdminBorrowManagementProps> = ({ initialData }) => {
    const [requests, setRequests] = useState<BorrowBookResponse[]>(initialData);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const pendingRequests = requests.filter(req => req.status === 'PENDING');
    const historyRequests = requests.filter(req => req.status !== 'PENDING');

    const handleApprove = async (borrowId: number) => {
        if (!confirm('Xác nhận duyệt yêu cầu mượn sách này?')) return;
        setIsLoading(true);
        try {
            await approveBorrowRequestAction(borrowId);
            alert('Duyệt thành công!');
            setRequests(prev => prev.map(req => req.borrowId === borrowId ? { ...req, status: 'BORROWED' } : req));
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (borrowId: number) => {
        if (!confirm('Từ chối yêu cầu mượn sách này?')) return;
        setIsLoading(true);
        try {
            await rejectBorrowRequestAction(borrowId);
            alert('Đã từ chối yêu cầu!');
            setRequests(prev => prev.map(req => req.borrowId === borrowId ? { ...req, status: 'REJECTED' } : req));
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Xét duyệt mượn sách</h1>
                    <p className="text-gray-500 mt-2">Quản lý và phê duyệt các yêu cầu mượn sách từ thành viên.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-10 p-5">
                <div className="bg-amber-50/50 px-6 py-5 flex items-center border-b border-gray-200 justify-between">
                    <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Yêu cầu chờ duyệt ({pendingRequests.length})
                    </h2>
                </div>

                {pendingRequests.length === 0 ? (
                    <div className="p-12 text-center flex flex-col pt-2 items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <p className="text-gray-500 font-medium">Không có yêu cầu nào đang chờ xử lý.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto pt-2">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Người mượn</th>
                                <th className="px-6 py-4 font-semibold">Thông tin sách</th>
                                <th className="px-6 py-4 font-semibold">Ngày yêu cầu</th>
                                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pendingRequests.map(req => (
                                <tr key={req.borrowId} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                {req.userEmail?.charAt(0) || 'U'}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm truncate max-w-[200px]" title={req.userEmail}>
                                        {req.userEmail}
                                    </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={req.imgUrl || '/file.svg'} alt="" className="w-10 h-14 object-cover rounded-md shadow-sm opacity-90 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-sm line-clamp-1">{req.title}</span>
                                                <span className="text-xs text-gray-500 mt-0.5">{req.author}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-600">
                                    {new Date(req.borrowedAt).toLocaleDateString('vi-VN')}
                                </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                disabled={isLoading}
                                                onClick={() => handleApprove(req.borrowId)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 font-medium text-sm rounded-xl hover:bg-emerald-100 disabled:opacity-50 transition-colors focus:outline-none"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Duyệt
                                            </button>
                                            <button
                                                disabled={isLoading}
                                                onClick={() => handleReject(req.borrowId)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 font-medium text-sm rounded-xl hover:bg-rose-100 disabled:opacity-50 transition-colors focus:outline-none"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                Từ chối
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {historyRequests.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-2">
                    <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            Lịch sử xử lý ({historyRequests.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Người mượn</th>
                                <th className="px-6 py-4 font-semibold">Thông tin sách</th>
                                <th className="px-6 py-4 font-semibold">Ngày yêu cầu</th>
                                <th className="px-6 py-4 font-semibold text-right">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {historyRequests.map(req => (
                                <tr key={req.borrowId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-700 text-sm">{req.userEmail}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={req.imgUrl || '/file.svg'} alt="" className="w-8 h-12 object-cover rounded border border-gray-100 shadow-sm opacity-80 shrink-0" />
                                            <span className="font-semibold text-gray-700 text-sm line-clamp-1">{req.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">
                                                {new Date(req.borrowedAt).toLocaleDateString('vi-VN')}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'BORROWED' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                    Đang mượn
                                                </span>
                                        )}
                                        {req.status === 'RETURNED' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                    Đã trả
                                                </span>
                                        )}
                                        {req.status === 'REJECTED' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                                                    Từ chối
                                                </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};