import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// BẮT BUỘC ĐỔI TÊN HÀM THÀNH proxy
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('adminAccessToken')?.value;

        // 1. Đang ở trang Login
        if (pathname.startsWith('/admin/login')) {
            if (token) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.next();
        }

        // 2. Không có token -> Bắt đăng nhập
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // 3. Có token -> Giải mã và check Role
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedJson = atob(payloadBase64);
            const payload = JSON.parse(decodedJson);

            // Kiểm tra Role, nếu KHÔNG phải ADMIN -> Xóa Cookie trình duyệt và đá về Login
            if (payload.scope !== 'ADMIN') {
                const response = NextResponse.redirect(new URL('/admin/login', request.url));
                response.cookies.delete('adminAccessToken');
                response.cookies.delete('adminRefreshToken');
                return response;
            }

        } catch (error) {
            // Token hỏng/rác -> Xóa Cookie trình duyệt và đá về Login
            const response = NextResponse.redirect(new URL('/admin/login', request.url));
            response.cookies.delete('adminAccessToken');
            response.cookies.delete('adminRefreshToken');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|_vercel|favicon.ico|sitemap.xml).*)',
    ],
};