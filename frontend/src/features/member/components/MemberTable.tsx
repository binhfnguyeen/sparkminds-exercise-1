'use client';

import { UserResponse } from '@/shared/types/auth.types';
import { formatDate } from "@/shared/utils/func.utils";

interface Props {
    members: UserResponse[];
    loading: boolean;
    page: number;
    totalPages: number;
    setPage: (p: number | ((prev: number) => number)) => void;
    onEdit: (member: UserResponse) => void;
    onDelete: (id: number) => void;
    onBlock: (id: number) => void;
    onUnblock: (id: number) => void;
}

export const MemberTable = ({
                                members, loading, page, totalPages, setPage, onEdit, onDelete, onBlock, onUnblock
                            }: Props) => {

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Đang HĐ</span>;
            case 'BLOCKED':
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">Bị Khóa</span>;
            case 'UNVERIFIED':
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Chưa XN</span>;
            case 'DELETED':
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Đã Xóa</span>;
            default:
                return <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">{status}</span>;
        }
    };

    return (
        <>
            {/* Đã xóa border, bg-white và shadow-sm ở thẻ bọc ngoài cùng */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                    {/* Header mềm mại hơn, chỉ có viền mỏng phía dưới */}
                    <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                        <th className="px-6 py-4 font-bold">Email</th>
                        <th className="px-6 py-4 font-bold">Họ & Tên</th>
                        <th className="px-6 py-4 font-bold">SĐT</th>
                        <th className="px-6 py-4 font-bold">Trạng thái</th>
                        <th className="px-6 py-4 font-bold text-center">Thao tác</th>
                    </tr>
                    </thead>

                    {/* Danh sách thành viên, chỉ ngăn cách nhau bởi viền mỏng mờ */}
                    <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-8 h-8 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
                                    <span>Đang tải dữ liệu hệ thống...</span>
                                </div>
                            </td>
                        </tr>
                    ) : members.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-16 text-center text-gray-400 font-medium">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    </div>
                                    <span>Không tìm thấy thành viên nào.</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        members.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                                            {member.email?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span className="font-bold text-gray-900">{member.email}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800">{member.lastName} {member.firstName}</span>
                                        <span className="text-xs text-gray-400 font-medium mt-0.5">SN: {formatDate(member.dateOfBirth)}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-gray-600 font-medium text-sm">
                                    {member.phone || <span className="text-gray-300 italic">Chưa cập nhật</span>}
                                </td>

                                <td className="px-6 py-4">
                                    {renderStatusBadge(member.status as string)}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">

                                        <button
                                            onClick={() => onEdit(member)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
                                            title="Sửa thông tin"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>

                                        {member.status === 'BLOCKED' ? (
                                            <button
                                                onClick={() => onUnblock(member.id as number)}
                                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors focus:outline-none"
                                                title="Mở khóa tài khoản"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                                            </button>
                                        ) : member.status !== 'DELETED' ? (
                                            <button
                                                onClick={() => onBlock(member.id as number)}
                                                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors focus:outline-none"
                                                title="Khóa tài khoản"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            </button>
                                        ) : null}

                                        <button
                                            onClick={() => onDelete(member.id as number)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
                                            title="Xóa vĩnh viễn"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => typeof p === 'number' ? p - 1 : p)}
                        className="px-4 py-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-xl disabled:opacity-50 text-sm font-bold transition-all text-gray-600 shadow-sm flex items-center gap-1.5 focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                        Trang trước
                    </button>

                    <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-700 font-bold bg-gray-50 rounded-xl">
                        <span className="text-gray-400">Trang</span>
                        <span className="text-blue-600">{page + 1}</span>
                        <span className="text-gray-400">/</span>
                        <span>{totalPages}</span>
                    </div>

                    <button
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-xl disabled:opacity-50 text-sm font-bold transition-all text-gray-600 shadow-sm flex items-center gap-1.5 focus:outline-none"
                    >
                        Trang sau
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            )}
        </>
    );
};