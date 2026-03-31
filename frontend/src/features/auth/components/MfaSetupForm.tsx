'use client';

import { useState } from 'react';
import {enableMfaAction, setupMfaAction} from "@/features/auth/actions/auth.action";
import {useAuth} from "@/features/auth/context/AuthContext";

export const MfaSetupForm = () => {
    const { user, setUser } = useAuth();
    const isAlreadyEnabled = user?.mfaEnabled === true;
    const [secret, setSecret] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSetup = async () => {
        setLoading(true); setError('');
        try {
            const res = await setupMfaAction();
            setSecret(res.result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnable = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await enableMfaAction(Number(otp));
            setSuccess(true);
            if (user) {
                setUser({
                    ...user,
                    mfaEnabled: true
                });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success || isAlreadyEnabled) {
        return (
            <div className="max-w-2xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Xác thực hai lớp (MFA)</h2>
                    <p className="text-sm text-gray-500 mt-1">Bảo vệ tài khoản của bạn khỏi các truy cập trái phép bằng Google Authenticator.</p>
                </div>

                <div className="p-8 bg-green-50 border border-green-200 rounded-3xl text-center shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                        {success ? 'Bật MFA Thành công!' : 'MFA Đã Được Kích Hoạt!'}
                    </h3>
                    <p className="text-green-700 max-w-md mx-auto leading-relaxed">
                        Tài khoản của bạn đang được bảo vệ an toàn bởi lớp bảo mật thứ hai. Bạn sẽ dùng mã OTP để đăng nhập trong những lần tiếp theo.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Xác thực hai lớp (MFA)</h2>
                <p className="text-sm text-gray-500 mt-1">Bảo vệ tài khoản của bạn khỏi các truy cập trái phép bằng Google Authenticator.</p>
            </div>

            <div className="p-6 sm:p-8 bg-white border border-gray-100 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.08)] rounded-3xl">
                {error && <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {error}
                </div>}

                {!secret ? (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa thiết lập MFA</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Tăng cường bảo mật tài khoản bằng cách yêu cầu mã xác nhận mỗi khi đăng nhập.
                        </p>
                        <button
                            onClick={handleSetup} disabled={loading}
                            className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all focus:ring-4 focus:ring-blue-200 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {loading ? 'Đang khởi tạo...' : 'Thiết lập ngay'}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleEnable} className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* Khu vực QR Code */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="p-3 bg-white border-2 border-dashed border-gray-300 rounded-2xl">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`otpauth://totp/BookBook?secret=${secret}&issuer=BookBook`)}`} alt="QR Code" className="w-40 h-40 rounded-lg" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 mt-3 uppercase tracking-wider">Quét mã bằng App</span>
                            </div>

                            {/* Khu vực text */}
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="font-bold text-gray-900 mb-2">1. Thêm tài khoản vào ứng dụng</h4>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    Mở ứng dụng <strong>Google Authenticator</strong> hoặc Authy, chọn quét mã QR. Nếu không thể quét mã, hãy nhập thủ công chuỗi khóa bên dưới:
                                </p>
                                <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                                    <code className="text-lg font-mono tracking-widest text-gray-800 font-bold select-all">
                                        {secret}
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100"></div>

                        {/* Khu vực nhập OTP */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3 text-center md:text-left">2. Nhập mã xác nhận (OTP)</h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text" required maxLength={6} value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 px-4 py-3.5 text-2xl tracking-[0.75em] text-center font-mono font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-900 transition-all placeholder-gray-300"
                                    placeholder="••••••"
                                />
                                <button type="submit" disabled={loading || otp.length !== 6} className="px-8 py-3.5 font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed">
                                    {loading ? 'Kích hoạt...' : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};