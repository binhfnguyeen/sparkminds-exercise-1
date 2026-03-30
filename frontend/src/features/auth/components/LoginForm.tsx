'use client';

import { useState } from 'react';
import {redirectAfterLogin, setAuthCookies} from "@/features/auth/actions/auth.action";
import {authService} from "@/features/auth/services/auth.services";

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
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold text-center">
                {isMfaStep ? 'Xác thực 2 bước (MFA)' : 'Đăng Nhập'}
            </h2>

            {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}

            {!isMfaStep ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mt-1 border rounded focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 mt-1 border rounded focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleMfaSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600">Vui lòng nhập mã 6 số từ ứng dụng Google Authenticator.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mã OTP</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Chỉ cho phép nhập số
                            className="w-full p-2 mt-1 text-center tracking-widest border rounded focus:ring focus:ring-blue-200"
                            placeholder="123456"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsMfaStep(false)}
                        className="w-full p-2 text-sm text-gray-600 hover:underline"
                    >
                        Quay lại đăng nhập
                    </button>
                </form>
            )}
        </div>
    );
}