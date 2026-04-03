'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    searchMembersAction,
    deleteMemberAction,
    blockMemberAction,
    unblockMemberAction
} from '@/features/member/actions/member.action';
import { MemberFilterForm } from '@/features/member/components/MemberFilterForm';
import {UserResponse} from "@/shared/types/auth.types";
import {SearchMemberParams} from "@/shared/types/member.types";
import {MemberFormModal} from "@/features/member/components/MemberFormModel";
import {MemberTable} from "@/features/member/components/MemberTable";

export default function MembersPage() {
    const [members, setMembers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const size = 10;

    const [searchParams, setSearchParams] = useState<SearchMemberParams>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<UserResponse | null>(null);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await searchMembersAction({ ...searchParams, page, size });
            if (res.code === 1000) {
                setMembers(res.result.content);
                setTotalPages(res.result.totalPages);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách thành viên:", error);
        } finally {
            setLoading(false);
        }
    }, [page, searchParams]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleSearch = (params: { keyword?: string; dobFrom?: string; dobTo?: string }) => {
        setSearchParams(params);
        setPage(0);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa thành viên này?')) return;

        try {
            const res = await deleteMemberAction(id);
            if (res.code === 1000) {
                alert('Xóa thành viên thành công!');
                if (members.length === 1 && page > 0) {
                    setPage(p => p - 1);
                } else {
                    fetchMembers();
                }
            }
        } catch (error) {
            alert('Lỗi khi xóa thành viên. Vui lòng thử lại.');
        }
    };

    const handleBlock = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn khóa thành viên này?')) return;

        try {
            const res = await blockMemberAction(id);
            if (res.code === 1000) {
                fetchMembers();
            }
        } catch (error) {
            alert('Lỗi khi khóa thành viên. Vui lòng thử lại.');
        }
    }

    const handleUnblock = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn mở khóa thành viên này?')) return;

        try {
            const res = await unblockMemberAction(id);
            if (res.code === 1000) {
                fetchMembers();
            }
        } catch (error) {
            alert('Lỗi khi mở khóa thành viên. Vui lòng thử lại.');
        }
    }

    const handleOpenCreate = () => {
        setEditingMember(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (member: UserResponse) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Thành viên</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý danh sách người dùng, phân quyền và thông tin cá nhân.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Thêm thành viên
                </button>
            </div>

            <MemberFilterForm onSearch={handleSearch} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                <MemberTable
                    members={members}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onBlock={handleBlock}
                    onUnblock={handleUnblock}
                />
            </div>

            <MemberFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingMember={editingMember}
                onSuccess={fetchMembers}
            />
        </div>
    );
}