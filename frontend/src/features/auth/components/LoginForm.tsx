'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../services/auth.services';
import { setAuthCookies, redirectAfterLogin } from '../actions/auth.action';

export const LoginForm = () => {
    // State đăng nhập cơ bản
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State bảo mật
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Luồng hiển thị: 0 = Login, 1 = MFA OTP, 2 = Bắt buộc đổi mật khẩu
    const [step, setStep] = useState<0 | 1 | 2>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 1. XỬ LÝ ĐĂNG NHẬP CHÍNH
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');

        try {
            const response = await authService.login(email, password);
            if (response.result.mfaRequired) {
                setStep(1); // Chuyển sang nhập OTP
            } else if (response.result.accessToken && response.result.refreshToken) {
                await setAuthCookies(response.result.accessToken, response.result.refreshToken);
                await redirectAfterLogin();
            }
        } catch (err: any) {
            // BẮT MÃ LỖI 1017: TÀI KHOẢN YÊU CẦU ĐỔI MẬT KHẨU (Do đang dùng mật khẩu tạm)
            if (err.code === 1017) {
                setStep(2); // Chuyển sang form ép buộc đổi mật khẩu
            } else {
                setError(err.message || 'Đăng nhập thất bại.');
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. XỬ LÝ XÁC THỰC MFA OTP (Giữ nguyên)
    const handleMfaSubmit = async (e: React.FormEvent) => {
        // ... (giữ nguyên code cũ của bạn) ...
    };

    // 3. XỬ LÝ ÉP BUỘC ĐỔI MẬT KHẨU LẦN ĐẦU (Hoặc sau khi reset)
    const handleForceChangeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới không khớp!');
            setLoading(false); return;
        }

        try {
            // Gọi API reset với: email đang nhập, tempPassword đang nằm sẵn trong biến `password`, và newPassword
            const response = await authService.changePasswordFirstTime({
                email,
                tempPassword: password,
                newPassword
            });

            if (response.result.accessToken) {
                await setAuthCookies(response.result.accessToken, response.result.refreshToken!);
                await redirectAfterLogin();
            }
        } catch (err: any) {
            setError(err.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {step === 0 && 'Chào mừng trở lại'}
                    {step === 1 && 'Xác thực 2 bước'}
                    {step === 2 && 'Đổi mật khẩu bảo mật'}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {step === 0 && 'Đăng nhập để tiếp tục truy cập hệ thống'}
                    {step === 1 && 'Bảo vệ tài khoản của bạn với mã OTP'}
                    {step === 2 && 'Bạn đang đăng nhập bằng mật khẩu tạm. Vui lòng thiết lập mật khẩu mới.'}
                </p>
            </div>

            {error && (
                <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {/* RENDER FORM 0: ĐĂNG NHẬP */}
            {step === 0 && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    {/* Giữ nguyên các thẻ input email, password của bạn ở đây... */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email của bạn</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                            <span className="ml-2">Ghi nhớ tôi</span>
                        </label>
                        <Link href="/client/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</Link>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3.5 px-4 mt-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700">
                        {loading ? 'Đang xử lý...' : 'Đăng nhập hệ thống'}
                    </button>
                </form>
            )}

            {/* RENDER FORM 1: OTP (Giữ nguyên của bạn) */}
            {step === 1 && (
                // ... giữ nguyên html OTP
                <></>
            )}

            {/* RENDER FORM 2: BẮT BUỘC ĐỔI MẬT KHẨU (1017) */}
            {step === 2 && (
                <form onSubmit={handleForceChangeSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
                        <input
                            type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                        <input
                            type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-3.5 px-4 font-bold text-white bg-green-600 rounded-xl hover:bg-green-700">
                        {loading ? 'Đang cập nhật...' : 'Cập nhật & Đăng nhập'}
                    </button>
                </form>
            )}

        </div>
    );
};