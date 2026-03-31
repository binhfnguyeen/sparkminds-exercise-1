'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/features/auth/services/auth.services';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Đang xác thực tài khoản của bạn...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Đường dẫn xác thực không hợp lệ hoặc bị thiếu thông tin.');
            return;
        }

        authService.verifyEmailLink(token)
            .then(() => {
                setStatus('success');
                setMessage('Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.message);
            });
    }, [token, router]);

    return (
        <div className="w-full max-w-md p-8 sm:p-10 bg-white shadow-2xl rounded-3xl border border-gray-100 text-center">
            {status === 'loading' && (
                <>
                    <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Đang xử lý</h2>
                    <p className="text-gray-500 mb-6">{message}</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Thành công!</h2>
                    <p className="text-gray-500 mb-6">{message}</p>
                    <Link href="/client/login" className="block w-full py-3 px-4 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all">
                        Đi tới Đăng nhập
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Xác thực thất bại</h2>
                    <p className="text-red-600 mb-6">{message}</p>
                    <Link href="/client/login" className="block w-full py-3 px-4 font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
                        Quay lại Đăng nhập
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="text-center font-medium text-gray-500">Đang tải cấu hình...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}