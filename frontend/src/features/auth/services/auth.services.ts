import {
    ApiDto,
    AuthenticateDto,
    UserCreateForm,
    UserDto,
    ResetPasswordForm,
    ChangePasswordForm, ChangeMailForm
} from "@/shared/api/api";

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

    async setupMfa(token: string): Promise<ApiDto<string>> {
        const res = await fetch(`${API_BASE_URL}/mfa/setup`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error("Lỗi khi lấy mã MFA");
        return res.json();
    },

    async enableMfa(token: string, code: number): Promise<ApiDto<string>> {
        const res = await fetch(`${API_BASE_URL}/mfa/enable?code=${code}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Mã OTP không hợp lệ");
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
    },

    async verifyEmailOtp(email: string, otp: string): Promise<ApiDto<any>> {
        const res = await fetch(`${API_BASE_URL}/verify-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Xác thực OTP thất bại. Vui lòng thử lại.');
        }
        return res.json();
    },

    async verifyEmailLink(token: string): Promise<ApiDto<string>> {
        const res = await fetch(`${API_BASE_URL}/verify-email-link?token=${encodeURIComponent(token)}`, {
            method: 'GET',
        });

        if (!res.ok) {
            let errorMessage = 'Xác thực tài khoản thất bại hoặc link đã hết hạn.';
            try {
                const errorData = await res.json();
                if (errorData.message) errorMessage = errorData.message;
            } catch (e) {
                errorMessage = `Lỗi hệ thống (Mã lỗi: ${res.status})`;
            }
            throw new Error(errorMessage);
        }

        return res.json();
    },

    async resendVerification(email: string): Promise<ApiDto<string>> {
        const res = await fetch(`${API_BASE_URL}/resend-verification?email=${encodeURIComponent(email)}`, {
            method: 'POST',
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Không thể gửi lại mã xác thực.');
        }
        return res.json();
    },

    async changePassword(token: string, data: ChangePasswordForm): Promise<ApiDto<UserDto>> {
        const res = await fetch(`${API_BASE_URL}/change-password`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Đổi mật khẩu thất bại");
        }
        return res.json();
    },

    async sendChangeMailOtp(token: string): Promise<ApiDto<string>> {
        const res = await fetch(`${API_BASE_URL}/send-otp-change-mail`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Không thể gửi OTP đổi email");
        }
        return res.json();
    },

    async changeMail(token: string, data: ChangeMailForm): Promise<ApiDto<UserDto>> {
        const res = await fetch(`${API_BASE_URL}/change-mail`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Đổi email thất bại");
        }
        return res.json();
    }
}