import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đăng ký | BookBook',
    description: 'Tạo tài khoản mới trên hệ thống BookBook',
};

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
            <RegisterForm />
        </div>
    );
}