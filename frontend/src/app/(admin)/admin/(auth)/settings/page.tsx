import {Suspense} from "react";
import {AdminSetting} from "@/features/auth/components/AdminSettingForm";

export default function AdminSettingsPage() {
    return (
        <div className="container max-w-6xl py-10 mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Cài đặt</h1>

            <Suspense fallback={<div className="text-center py-10 text-gray-500">Đang tải cấu hình...</div>}>
                <AdminSetting />
            </Suspense>
        </div>
    );
}