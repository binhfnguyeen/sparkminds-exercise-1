'use client';

import { UserResponse } from '@/shared/types/auth.types';
import {formatDate} from "@/shared/utils/func.utils";

interface Props {
    members: UserResponse[];
    loading: boolean;
    page: number;
    totalPages: number;
    setPage: (p: number | ((prev: number) => number)) => void;
    onEdit: (member: UserResponse) => void;
    onDelete: (id: number) => void;
}

export const MemberTable = ({
    members, loading, page, totalPages, setPage, onEdit, onDelete
}: Props) => {
    return (
        <>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Họ</th>
                        <th className="p-4 font-semibold">Tên</th>
                        <th className="p-4 font-semibold">SĐT</th>
                        <th className="p-4 font-semibold">Ngày sinh</th>
                        <th className="p-4 font-semibold text-center">Thao tác</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                                Đang tải dữ liệu hệ thống...
                            </td>
                        </tr>
                    ) : members.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                                Không tìm thấy thành viên nào.
                            </td>
                        </tr>
                    ) : (
                        members.map((member) => (
                            <tr key={member.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">
                                    {member.email}
                                </td>

                                <td className="p-4 text-gray-600">
                                    {member.firstName}
                                </td>

                                <td className="p-4 text-gray-600 font-semibold">
                                    {member.lastName}
                                </td>

                                <td className="p-4 text-gray-600">
                                    {member.phone || '-'}
                                </td>

                                <td className="p-4 text-gray-600">
                                    {formatDate(member.dateOfBirth)}
                                </td>

                                <td className="p-4 text-center space-x-2">
                                    <button
                                        onClick={() => onEdit(member)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                                        title="Sửa"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => onDelete(member.id as number)}
                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                        title="Xóa"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-4">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-1.5 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg disabled:opacity-50 text-sm font-semibold transition-colors text-gray-700"
                >
                    Trang trước
                </button>

                <div className="px-4 py-1.5 text-sm text-gray-700 font-bold bg-white border border-gray-200 rounded-lg">
                    Trang {page + 1} / {totalPages || 1}
                </div>

                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-1.5 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg disabled:opacity-50 text-sm font-semibold transition-colors text-gray-700"
                >
                    Trang tiếp
                </button>
            </div>
        </>
    );
};