'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { authService } from '../services/auth.services';
import {setAuthCookies, redirectAfterLogin, loginWithGoogle} from '../actions/auth.action';
import {useAuth} from "@/features/auth/context/AuthContext";
import {GoogleLogin, CredentialResponse} from "@react-oauth/google";

export const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 0 = Login, 1 = MFA OTP, 2 = Bắt buộc đổi mật khẩu
    const [step, setStep] = useState<0 | 1 | 2>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedMfaEmail = localStorage.getItem('savedMfaEmail');
        if (savedMfaEmail) {
            setEmail(savedMfaEmail);
            setStep(1);
        }
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(email, password, rememberMe);
            if (response.result.mfaRequired) {
                setStep(1); // Chuyển sang nhập OTP
            } else if (response.result.accessToken && response.result.refreshToken) {
                await setAuthCookies(response.result.accessToken, response.result.refreshToken, rememberMe);
                login();
                await redirectAfterLogin();
            }
        } catch (err: any) {
            if (err.code === 1017) {
                setStep(2);
            } else {
                setError(err.message || 'Đăng nhập thất bại.');
            }
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
                localStorage.setItem('savedMfaEmail', email);
                await setAuthCookies(response.result.accessToken, response.result.refreshToken);
                login();
                await redirectAfterLogin();
            }
        } catch (err: any) {
            setError(err.message || 'Mã xác thực không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    const handleForceChangeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới không khớp!');
            setLoading(false); return;
        }

        try {
            const response = await authService.changePasswordFirstTime({
                email,
                tempPassword: password,
                newPassword
            });

            if (response.result.accessToken) {
                await setAuthCookies(response.result.accessToken, response.result.refreshToken!);
                login();
                await redirectAfterLogin();
            }
        } catch (err: any) {
            setError(err.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            setError('');
            const idToken = credentialResponse.credential;
            if (idToken != null){
                const response = await loginWithGoogle(idToken, rememberMe);

                if (response.result.mfaRequired) {
                    setStep(1);
                } else if (response.result.accessToken && response.result.refreshToken) {
                    await setAuthCookies(response.result.accessToken, response.result.refreshToken, rememberMe);
                    login();
                    await redirectAfterLogin();
                }
            } else {
                console.error("Không lấy được Google Client:", error);
            }
        } catch (error: any) {
            console.error("Lỗi đăng nhập bằng Google:", error);
            setError(error.message || "Đăng nhập bằng Google thất bại hoặc tài khoản của bạn đã bị khóa.");
        }
    }

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
                <div className="space-y-5"> {/* Đổi form thành div để bao bọc cả form cũ và nút Google */}
                    <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="ml-2">Ghi nhớ tôi</span>
                            </label>
                            <Link href="/client/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</Link>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3.5 px-4 mt-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700">
                            {loading ? 'Đang xử lý...' : 'Đăng nhập hệ thống'}
                        </button>
                    </form>

                    {/* --- BỔ SUNG PHẦN GOOGLE LOGIN TẠI ĐÂY --- */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-sm text-gray-500">Hoặc tiếp tục với</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.error('Đăng nhập Google thất bại');
                                setError('Không thể đăng nhập bằng Google. Vui lòng thử lại.');
                            }}
                            width="100%"
                        />
                    </div>
                </div>
            )}

            {/* RENDER FORM 1: OTP */}
            {step === 1 && (
                <form onSubmit={handleMfaSubmit} className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <p className="text-sm text-blue-800">
                            Xin chào <strong>{email}</strong>!
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Mở ứng dụng Google Authenticator và nhập mã để tiếp tục.
                        </p>
                    </div>

                    <div>
                        <input
                            type="text" required maxLength={6} value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-4 text-3xl font-bold tracking-[0.5em] text-center text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            placeholder="------"
                        />
                    </div>

                    <button
                        type="submit" disabled={loading || otp.length !== 6}
                        className="w-full py-3.5 px-4 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem('savedMfaEmail');
                            setEmail('');
                            setOtp('');
                            setStep(0);
                        }}
                        className="w-full py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                    >
                        Đăng nhập bằng tài khoản khác
                    </button>
                </form>
            )}

            {/* RENDER FORM 2: BẮT BUỘC ĐỔI MẬT KHẨU */}
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