import {NextRequest, NextResponse} from "next/server";

export function proxy(request: NextRequest) {
    if (request.headers.has('next-action')) {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('adminAccessToken')?.value;

        if (pathname.startsWith('/admin/login')) {
            if (token) {
                return NextResponse.redirect(new URL('/admin/vocabularies', request.url));
            }
            return NextResponse.next();
        }

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            let payloadBase64 = token.split('.')[1];

            payloadBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
            while (payloadBase64.length % 4 !== 0) {
                payloadBase64 += '=';
            }

            const decodedJson = atob(payloadBase64);
            const payload = JSON.parse(decodedJson);

            if (payload.scope !== 'ROLE_ADMIN') {
                const response = NextResponse.redirect(new URL('/admin/login', request.url));
                response.cookies.delete('adminAccessToken');
                response.cookies.delete('adminRefreshToken');
                return response;
            }

        } catch (error) {
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