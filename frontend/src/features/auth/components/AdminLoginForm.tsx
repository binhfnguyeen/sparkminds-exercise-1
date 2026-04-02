'use client';

import { useState } from 'react';
import { authService } from '../services/auth.services';
import { setAdminAuthCookies, redirectAfterAdminLogin } from '../actions/auth.action';

export const AdminLoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(email, password, false);

            if (response.result.accessToken && response.result.refreshToken) {
                await setAdminAuthCookies(response.result.accessToken, response.result.refreshToken);
                await redirectAfterAdminLogin();
            } else {
                setError('Dữ liệu phản hồi từ hệ thống không hợp lệ.');
            }
        } catch (err: any) {
            setError(err.message || 'Đăng nhập quản trị thất bại. Vui lòng kiểm tra lại quyền truy cập.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Đăng nhập Quản trị
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Sử dụng tài khoản nội bộ để truy cập
                </p>
            </div>

            {error && (
                <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email quản trị viên</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-600 outline-none transition-all"
                        placeholder="bookbook@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-600 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 mt-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                >
                    { loading ? 'Đang xác thực...' : 'Đăng nhập'}
                </button>
            </form>
        </div>
    );
};