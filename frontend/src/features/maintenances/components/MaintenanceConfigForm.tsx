'use client';

import React, { useState, useEffect } from 'react';
import { getSystemConfigAction, toggleMaintenanceAction } from '../actions/config.actions';

export const MaintenanceConfigForm = () => {
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await getSystemConfigAction();
                if (res.code === 1000) {
                    setIsMaintenance(res.result.maintenanceMode);
                }
            } catch (error) {
                console.error('Lỗi lấy cấu hình:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleToggle = async () => {
        const confirmMsg = isMaintenance
            ? 'Bạn có chắc chắn muốn TẮT chế độ bảo trì? Hệ thống sẽ hoạt động bình thường.'
            : 'Bạn có chắc chắn muốn BẬT chế độ bảo trì?\n\n- Các người dùng thường sẽ KHÔNG THỂ truy cập hệ thống.\n- Hệ thống sẽ GỬI EMAIL thông báo đến toàn bộ người dùng.';

        if (!confirm(confirmMsg)) return;

        setIsLoading(true);
        try {
            const newState = !isMaintenance;
            await toggleMaintenanceAction(newState);
            setIsMaintenance(newState);
            alert(`Đã ${newState ? 'BẬT' : 'TẮT'} chế độ bảo trì thành công!`);
        } catch (error: any) {
            alert(error.message || 'Lỗi cập nhật cấu hình');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${isMaintenance ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Bảo trì hệ thống (Maintenance Mode)</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý trạng thái bảo trì. Khi bật, người dùng sẽ bị chặn ở màn hình đăng nhập.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="py-8 text-center text-gray-500 font-medium flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    Đang tải cấu hình...
                </div>
            ) : (
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-colors ${isMaintenance ? 'bg-rose-50/50 border-rose-100' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="mb-4 sm:mb-0">
                        <h3 className={`font-bold ${isMaintenance ? 'text-rose-800' : 'text-gray-800'}`}>
                            Trạng thái hiện tại
                        </h3>
                        <p className={`text-sm mt-1 font-medium ${isMaintenance ? 'text-rose-600' : 'text-gray-500'}`}>
                            {isMaintenance
                                ? 'Hệ thống ĐANG BẢO TRÌ. Chỉ Admin mới có thể gọi API.'
                                : 'Hệ thống đang hoạt động bình thường.'}
                        </p>
                    </div>

                    <button
                        onClick={handleToggle}
                        disabled={isLoading}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isMaintenance ? 'bg-rose-500 shadow-md shadow-rose-500/20' : 'bg-gray-300'}`}
                        title={isMaintenance ? "Tắt bảo trì" : "Bật bảo trì"}
                    >
                        <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${isMaintenance ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            )}
        </div>
    );
};