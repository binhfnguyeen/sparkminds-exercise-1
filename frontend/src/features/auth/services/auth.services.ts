import {ApiDto, AuthenticateDto} from "@/shared/api/api";

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
            throw new Error(errorData.message || 'Login failed');
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
    }
}