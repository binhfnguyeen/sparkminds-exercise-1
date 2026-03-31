'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {revalidatePath} from "next/cache";
import {authService} from "@/features/auth/services/auth.services";
import {ChangeMailForm, ChangePasswordForm} from "@/shared/api/api";

const API_BASE_URL = 'http://localhost:8081/api';

export async function setAuthCookies(accessToken: string, refreshToken: string){
    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
    });

    cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
    });

    revalidatePath('/client', 'layout');
}

export async function redirectAfterLogin() {
    redirect('/client');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

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

    redirect('/client/login');
}

export async function setupMfaAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) throw new Error("Chưa xác thực, không tìm thấy Token");

    return authService.setupMfa(token);
}

export async function enableMfaAction(code: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) throw new Error("Chưa xác thực");

    return authService.enableMfa(token, code);
}

export async function changePasswordAction(data: ChangePasswordForm) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) throw new Error("Chưa xác thực");
    return authService.changePassword(token, data);
}

export async function sendChangeMailOtpAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) throw new Error("Chưa xác thực");
    return authService.sendChangeMailOtp(token);
}

export async function changeMailAction(data: ChangeMailForm) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    if (!token) throw new Error("Chưa xác thực");
    return authService.changeMail(token, data);
}
