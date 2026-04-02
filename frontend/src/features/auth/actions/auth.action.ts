'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";
import { authService } from "@/features/auth/services/auth.services";
import { ChangeMailForm, ChangePasswordForm } from "@/shared/types/auth.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

type CookieOptions = {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    path?: string;
    maxAge?: number;
    expires?: Date;
};

const getActiveToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('adminAccessToken')?.value || cookieStore.get('accessToken')?.value;
};

export async function setAuthCookies(accessToken: string, refreshToken: string, rememberMe: boolean = false) {
    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
    });

    const refreshTokenOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    };

    if (rememberMe) {
        refreshTokenOptions.maxAge = 7 * 24 * 60 * 60;
    }

    cookieStore.set('refreshToken', refreshToken, refreshTokenOptions);

    revalidatePath('/client', 'layout');
}

export async function redirectAfterLogin() {
    redirect('/client');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const accessToken = await getActiveToken();

    if (accessToken) {
        try {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Lỗi khi gọi API Logout backend:', error);
        }
    }

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete({
        name: 'adminAccessToken',
        path: '/admin'
    });
    cookieStore.delete({
        name: 'adminRefreshToken',
        path: '/admin'
    });
}

export async function setupMfaAction() {
    const token = await getActiveToken();
    if (!token) throw new Error("Chưa xác thực, không tìm thấy Token");
    return authService.setupMfa(token);
}

export async function enableMfaAction(code: number) {
    const token = await getActiveToken();
    if (!token) throw new Error("Chưa xác thực");
    return authService.enableMfa(token, code);
}

export async function changePasswordAction(data: ChangePasswordForm) {
    const token = await getActiveToken();
    if (!token) throw new Error("Chưa xác thực");
    return authService.changePassword(token, data);
}

export async function sendChangeMailOtpAction() {
    const token = await getActiveToken();
    if (!token) throw new Error("Chưa xác thực");
    return authService.sendChangeMailOtp(token);
}

export async function changeMailAction(data: ChangeMailForm) {
    const token = await getActiveToken();
    if (!token) throw new Error("Chưa xác thực");
    return authService.changeMail(token, data);
}

export async function getProfileAction() {
    const token = await getActiveToken();
    if (!token) throw new Error("Chưa xác thực");
    return authService.getProfile(token);
}

export async function loginWithGoogle(idToken: string, rememberMe: boolean) {
    return authService.loginWithGoogle(idToken, rememberMe);
}

export async function setAdminAuthCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();

    const sessionCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/admin',
    };

    cookieStore.set('adminAccessToken', accessToken, sessionCookieOptions);
    cookieStore.set('adminRefreshToken', refreshToken, sessionCookieOptions);

    revalidatePath('/admin', 'layout');
}

export async function redirectAfterAdminLogin() {
    redirect('/admin');
}