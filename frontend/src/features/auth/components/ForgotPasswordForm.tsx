'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../services/auth.services';

export const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Đã gửi mật khẩu tạm!</h2>
                <p className="text-gray-500 mb-6">
                    Vui lòng kiểm tra hộp thư <strong>{email}</strong> và sử dụng mật khẩu trong email để đăng nhập. Hệ thống sẽ yêu cầu bạn đổi mật khẩu mới ngay sau đó.
                </p>
                <Link href="/client/login" className="block w-full py-3 px-4 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700">
                    Đi tới Đăng nhập
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Khôi phục mật khẩu</h2>
                <p className="mt-2 text-sm text-gray-500">Nhập email của bạn để nhận mật khẩu đăng nhập tạm thời</p>
            </div>

            {error && <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-lg"><p>{error}</p></div>}

            <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email đã đăng ký</label>
                    <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="name@example.com"
                    />
                </div>
                <button
                    type="submit" disabled={loading}
                    className="w-full py-3.5 px-4 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 focus:ring-4 focus:ring-blue-200"
                >
                    {loading ? 'Đang gửi...' : 'Nhận mật khẩu tạm'}
                </button>
            </form>

            <div className="text-center mt-6">
                <Link href="/client/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">&larr; Quay lại đăng nhập</Link>
            </div>
        </div>
    );
};