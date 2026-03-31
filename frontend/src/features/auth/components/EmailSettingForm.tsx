'use client';

import { useState } from 'react';
import { changeMailAction, sendChangeMailOtpAction } from '@/features/auth/actions/auth.action';

export const EmailSettingForm = () => {
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<1 | 2>(1); // Step 1: Nhập email mới & Gửi OTP -> Step 2: Nhập OTP

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // BƯỚC 1: Yêu cầu backend gửi OTP (Backend sẽ gửi vào email cũ/hiện tại)
    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!newEmail) {
            setMessage({ type: 'error', text: 'Vui lòng nhập địa chỉ email mới trước.' });
            return;
        }

        setLoading(true);
        try {
            await sendChangeMailOtpAction(); // API không cần body, tự lấy token để gửi mail cũ
            setStep(2);
            setMessage({
                type: 'success',
                text: 'Mã xác nhận (OTP) đã được gửi đến EMAIL HIỆN TẠI của bạn. Vui lòng kiểm tra hộp thư!'
            });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Không thể yêu cầu mã OTP.' });
        } finally {
            setLoading(false);
        }
    };

    // BƯỚC 2: Gửi Email mới + OTP để cập nhật
    const handleSubmitChangeMail = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (otp.length < 6) {
            setMessage({ type: 'error', text: 'Vui lòng nhập đủ 6 số OTP.' });
            return;
        }

        setLoading(true);
        try {
            // Truyền cả email mới và otp xuống backend
            await changeMailAction({
                newEmail: newEmail,
                otp: otp
            });
            setMessage({ type: 'success', text: 'Cập nhật địa chỉ email thành công!' });
            setStep(1); // Reset form về ban đầu
            setNewEmail('');
            setOtp('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Cập nhật email thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl animate-in fade-in duration-300">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Đổi Email liên kết</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Để bảo mật, hệ thống sẽ gửi một mã xác nhận (OTP) về <strong className="text-gray-700">email hiện tại</strong> của bạn trước khi cho phép đổi sang email mới.
                </p>
            </div>

            <form
                onSubmit={step === 1 ? handleRequestOtp : handleSubmitChangeMail}
                className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.08)] transition-all"
            >
                {/* Khu vực thông báo Alert */}
                {message.text && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-in fade-in zoom-in-95 ${
                        message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {message.type === 'success' ? (
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        )}
                        <span className="flex-1 leading-relaxed">{message.text}</span>
                    </div>
                )}

                {/* Ô nhập Email mới */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ Email mới</label>
                    <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        disabled={step === 2 || loading} // Đã sang bước 2 thì khóa lại không cho sửa mail nữa
                        placeholder="Nhập email mới của bạn"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-gray-800 placeholder-gray-400 disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Ô nhập OTP (Chỉ hiện ra khi đã bấm Gửi mã OTP ở Bước 1) */}
                {step === 2 && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="h-px bg-gray-100 my-5"></div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã xác nhận (OTP)</label>
                        <p className="text-xs text-gray-500 mb-3">Vui lòng kiểm tra hòm thư của <strong className="text-gray-800">email hiện tại (email cũ)</strong> để lấy mã.</p>

                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Chặn nhập chữ, chỉ cho nhập số
                            disabled={loading}
                            placeholder="••••••"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-gray-900 tracking-[0.5em] font-mono text-center sm:text-left text-xl disabled:opacity-60"
                        />

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-3 inline-block transition-colors"
                        >
                            Quay lại sửa email mới?
                        </button>
                    </div>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !newEmail || (step === 2 && otp.length < 6)}
                        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-4 focus:ring-gray-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:justify-start w-full sm:w-auto"
                    >
                        {loading && (
                            <svg className="animate-spin -ml-1 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {/* Text nút bấm thay đổi linh hoạt theo từng bước */}
                        {step === 1 ? (loading ? 'Đang gửi mã...' : 'Gửi mã OTP xác nhận') : (loading ? 'Đang xử lý...' : 'Xác nhận Đổi Email')}
                    </button>
                </div>
            </form>
        </div>
    );
};