'use client';

import { useState } from 'react';
import {redirectAfterLogin, setAuthCookies} from "@/features/auth/actions/auth.action";
import {authService} from "@/features/auth/services/auth.services";
import Link from "next/link";

export default function LoginForm(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    const [isMfaStep, setIsMfaStep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(email, password);

            if (response.result.mfaRequired) {
                // Chuyển sang bước nhập OTP, giữ lại email để gửi kèm OTP
                setIsMfaStep(true);
            } else if (response.result.accessToken && response.result.refreshToken) {
                // Đăng nhập thành công (Tài khoản không bật MFA)
                await setAuthCookies(response.result.accessToken, response.result.refreshToken);
                await redirectAfterLogin();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.verifyMfa(email, Number(otp));

            if (response.result.accessToken && response.result.refreshToken) {
                // Xác thực OTP thành công
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
                    {isMfaStep ? 'Xác thực 2 bước' : 'Chào mừng trở lại'}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {isMfaStep ? 'Bảo vệ tài khoản của bạn với mã OTP' : 'Đăng nhập để tiếp tục truy cập hệ thống'}
                </p>
            </div>

            {error && (
                <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
                    <p className="font-medium">Lỗi đăng nhập!</p>
                    <p>{error}</p>
                </div>
            )}

            {!isMfaStep ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email của bạn</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <span className="ml-2">Ghi nhớ tôi</span>
                        </label>
                        <Link href="/client/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 mt-4 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-200"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập hệ thống'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleMfaSubmit} className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-blue-800">
                            Mở ứng dụng <strong>Google Authenticator</strong> trên điện thoại và nhập mã 6 số để tiếp tục.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Mã bảo mật (OTP)</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-4 text-3xl font-bold tracking-[0.5em] text-center text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="------"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full py-3.5 px-4 font-bold text-white transition-all bg-green-600 rounded-xl hover:bg-green-700 hover:shadow-lg disabled:bg-green-300 disabled:cursor-not-allowed focus:ring-4 focus:ring-green-200"
                    >
                        {loading ? 'Đang xác thực...' : 'Xác thực bảo mật'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsMfaStep(false)}
                        className="w-full py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                    >
                        &larr; Quay lại đăng nhập
                    </button>
                </form>
            )}
        </div>
    );
}