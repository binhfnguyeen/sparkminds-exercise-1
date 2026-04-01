'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.services';

export const RegisterForm = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [isRegistered, setIsRegistered] = useState(false);
    const [otp, setOtp] = useState('')
    const [resendLoading, setResendLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu nhập lại không khớp!');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...submitData } = formData;
            await authService.register(submitData);

            setIsRegistered(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            await authService.verifyEmailOtp(formData.email, otp);
            setSuccessMsg('Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');

            setTimeout(() => {
                router.push('/client/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            await authService.resendVerification(formData.email);
            setSuccessMsg('Mã xác thực mới đã được gửi vào email của bạn.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setResendLoading(false);
        }
    };

    if (isRegistered) {
        return (
            <div className="w-full max-w-md p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Xác thực Email</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Vui lòng nhập mã OTP gồm 6 số đã được gửi đến email <strong>{formData.email}</strong> hoặc click vào link trong email.
                </p>

                {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>}
                {successMsg && <div className="p-3 mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">{successMsg}</div>}

                <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                    <div>
                        <input
                            type="text" required maxLength={6} value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-4 text-3xl font-bold tracking-[0.5em] text-center text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="------"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading || otp.length !== 6 || successMsg.includes('thành công')}
                        className="w-full py-3 px-4 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 focus:ring-4 focus:ring-blue-200"
                    >
                        {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-3">
                    <button
                        type="button" onClick={handleResendOtp} disabled={resendLoading}
                        className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                        {resendLoading ? 'Đang gửi lại...' : 'Chưa nhận được mã? Gửi lại'}
                    </button>

                    <Link href="/client/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                        Quay lại Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tạo tài khoản mới</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Gia nhập hệ thống để bắt đầu hành trình học tập của bạn
                </p>
            </div>

            {error && (
                <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-lg" role="alert">
                    <p className="font-medium">Lỗi đăng ký!</p>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Họ</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Nguyễn"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Văn A"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="09xxxxxxxx"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày sinh</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            required
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="name@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 mt-4 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-300 disabled:cursor-not-allowed focus:ring-4 focus:ring-blue-200"
                >
                    {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
                </button>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Bạn đã có tài khoản?{' '}
                        <Link href="/client/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Đăng nhập tại đây
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};