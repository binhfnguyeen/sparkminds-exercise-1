import {ApiDto, AuthenticateDto, UserCreateForm, UserDto, ResetPasswordForm } from "@/shared/api/api";

const API_BASE_URL = 'http://localhost:8081/api';

export const authService = {
    async login(email: string, password: string): Promise<ApiDto<AuthenticateDto>> {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return Promise.reject(errorData);
        }
        return res.json();
    },

    async verifyMfa(email: string, code: number): Promise<ApiDto<AuthenticateDto>> {
        const res = await fetch(`${API_BASE_URL}/login/mfa-verify?email=${email}&code=${code}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Invalid OTP');
        }
        return res.json();
    },

    async register(
        { email, password, phone, firstName, lastName } : UserCreateForm
    ): Promise<ApiDto<UserDto>> {
        const res = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                phone,
                firstName,
                lastName
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
        return res.json();
    },

    async forgotPassword(email: string): Promise<ApiDto<string>> {
        const res = await fetch(`${API_BASE_URL}/forgot-password?email=${encodeURIComponent(email)}`, {
            method: 'POST',
        });

        if (!res.ok) {
            const errorData = await res.json();
            return Promise.reject(errorData);
        }
        return res.json();
    },

    async changePasswordFirstTime({ email, tempPassword, newPassword }: ResetPasswordForm): Promise<ApiDto<AuthenticateDto>> {
        const res = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                tempPassword,
                newPassword
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return Promise.reject(errorData);
        }
        return res.json();
    }

}