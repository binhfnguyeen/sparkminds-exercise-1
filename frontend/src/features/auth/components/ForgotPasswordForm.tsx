'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../services/auth.services';
import { setAuthCookies, redirectAfterLogin } from '../actions/auth.action';

export const ForgotPasswordForm = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');

    // State cho Bước 2
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Xử lý gửi yêu cầu quên mật khẩu (Bước 1)
    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSuccessMsg(`Một mật khẩu tạm thời đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư của bạn.`);
            setStep(2); // Chuyển sang form đổi mật khẩu
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý đổi mật khẩu (Bước 2)
    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới không khớp!');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.resetPassword({
                email,
                tempPassword,
                newPassword
            });

            if (response.result.accessToken && response.result.refreshToken) {
                // Đổi mật khẩu thành công và tự động đăng nhập
                await setAuthCookies(response.result.accessToken, response.result.refreshToken);
                await redirectAfterLogin();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Khôi phục mật khẩu
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {step === 1 ? 'Nhập email của bạn để nhận mã khôi phục' : 'Thiết lập mật khẩu mới cho tài khoản'}
                </p>
            </div>

            {error && (
                <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {successMsg && step === 2 && (
                <div className="p-4 mb-6 text-sm text-green-700 bg-green-50 border-l-4 border-green-500 rounded-r-lg" role="alert">
                    <p>{successMsg}</p>
                </div>
            )}

            {step === 1 ? (
                <form onSubmit={handleRequestSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email đã đăng ký</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="name@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-200"
                    >
                        {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu tạm thời (từ email)</label>
                        <input
                            type="text"
                            required
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none tracking-widest"
                            placeholder="Nhập mã từ email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nhập lại mật khẩu mới</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 font-bold text-white transition-all bg-green-600 rounded-xl hover:bg-green-700 hover:shadow-lg disabled:bg-green-300 disabled:cursor-not-allowed focus:ring-4 focus:ring-green-200"
                    >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu & Đăng nhập'}
                    </button>
                </form>
            )}

            <div className="text-center mt-6">
                <Link href="/client/login" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
                    &larr; Quay lại đăng nhập
                </Link>
            </div>
        </div>
    );
};