import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quên mật khẩu | BookBook',
    description: 'Khôi phục mật khẩu tài khoản BookBook',
};

export default function ForgotPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
            <ForgotPasswordForm />
        </div>
    );
}