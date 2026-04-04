import {ApiResponse} from "@/shared/types/api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const configService = {
    getConfig: async (token: string): Promise<ApiResponse<{ maintenanceMode: boolean }>> => {
        const res = await fetch(`${API_URL}/admin/config`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Lỗi lấy cấu hình hệ thống');
        return res.json();
    },

    toggleMaintenance: async (token: string, enabled: boolean): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/admin/config/maintenance?enabled=${enabled}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error('Lỗi cập nhật trạng thái bảo trì');
        return res.json();
    }
}