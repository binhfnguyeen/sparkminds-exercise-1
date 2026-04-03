import {MemberCreateRequest, MemberUpdateRequest, SearchMemberParams} from "@/shared/types/member.types";
import {ApiResponse, PageResponse} from "@/shared/types/api.types";
import {UserResponse} from "@/shared/types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const memberService = {
    searchMembers: async (
        token: string,
        params: SearchMemberParams
    ): Promise<ApiResponse<PageResponse<UserResponse>>> => {
        const query = new URLSearchParams();
        if (params.keyword?.trim()) query.append('keyword', params.keyword);
        if (params.dobFrom) query.append('dobFrom', params.dobFrom);
        if (params.dobTo) query.append('dobTo', params.dobTo);
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);

        const res = await fetch(`${API_URL}/members/search?${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error('Lỗi khi tìm kiếm thành viên');

        return res.json();
    },

    createMember: async (
        token: string,
        data: MemberCreateRequest
    ): Promise<ApiResponse<UserResponse>> => {
        const res = await fetch(`${API_URL}/members`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Lỗi khi tạo thành viên');

        return res.json();
    },

    updateMember: async (
        token: string,
        id: number,
        data: MemberUpdateRequest
    ): Promise<ApiResponse<UserResponse>> => {
        const res = await fetch(`${API_URL}/members/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Lỗi khi cập nhật thành viên');

        return res.json();
    },

    deleteMember: async (token: string, id: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/members/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error('Lỗi khi xóa thành viên');

        return res.json();
    },

    unblockMember: async (token: string, id: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/members/${id}/unblock`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || 'Lỗi khi mở khóa thành viên');
        }
        return res.json();
    },

    blockMember: async (token: string, id: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/members/${id}/block`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || 'Lỗi khi khóa thành viên');
        }
        return res.json();
    }
};