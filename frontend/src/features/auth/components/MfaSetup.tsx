'use client';

import { useState } from 'react';
import {enableMfaAction, setupMfaAction} from "@/features/auth/actions/auth.action";

export const MfaSetup = () => {
    const [secret, setSecret] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSetup = async () => {
        setLoading(true); setError('');
        try {
            const res = await setupMfaAction();
            setSecret(res.result); // Chuỗi Secret Base32 trả về từ Spring Boot
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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center max-w-md">
                <h3 className="text-xl font-bold text-green-700 mb-2">Bật MFA Thành công!</h3>
                <p className="text-sm text-green-600">
                    Tài khoản của bạn đã được bảo vệ. Lần đăng nhập tới, bạn có thể đăng nhập siêu tốc bằng mã OTP mà không cần mật khẩu.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-md p-6 bg-white border border-gray-100 shadow-xl rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Bảo mật đa lớp (MFA)</h3>

            {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

            {!secret ? (
                <div>
                    <p className="text-sm text-gray-500 mb-4">
                        Bật MFA để bảo vệ tài khoản và kích hoạt tính năng đăng nhập không cần mật khẩu.
                    </p>
                    <button
                        onClick={handleSetup} disabled={loading}
                        className="w-full py-2 font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                        {loading ? 'Đang tạo mã...' : 'Bắt đầu Cài đặt'}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleEnable} className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
                            Quét mã QR này bằng Google Authenticator:
                        </p>

                        {/* Tạo QR Code tự động từ chuỗi Secret */}
                        <div className="mt-4 mb-4 flex justify-center bg-white p-2 rounded-lg inline-block mx-auto border">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/BookBook?secret=${secret}&issuer=BookBook`} alt="QR Code" className="w-32 h-32" />
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-2">Hoặc nhập mã tay:</p>
                        <p className="text-lg font-mono text-center tracking-widest text-blue-600 font-bold">
                            {secret}
                        </p>
                    </div>

                    <div>
                        <input
                            type="text" required maxLength={6} value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 text-2xl tracking-[0.5em] text-center font-bold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="------"
                        />
                    </div>

                    <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? 'Đang kích hoạt...' : 'Xác nhận Kích hoạt MFA'}
                    </button>
                </form>
            )}
        </div>
    );
};