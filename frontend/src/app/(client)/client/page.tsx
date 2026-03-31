import { MfaSetup } from '@/features/auth/components/MfaSetup';

export default function ClientHomePage() {
    return (
        <div className="container p-8 mx-auto max-w-7xl">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Trang Tổng Quan Client</h1>
            <p className="text-gray-500 mb-8">Chào mừng bạn đã đăng nhập thành công vào hệ thống BookBook.</p>

            <div className="mt-10">
                <MfaSetup />
            </div>
        </div>
    );
}