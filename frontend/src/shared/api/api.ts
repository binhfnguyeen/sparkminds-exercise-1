export interface ApiDto<T> {
    code: number;
    message: string;
    result: T;
}

export interface AuthenticateDto {
    accessToken: string | null;
    refreshToken: string | null;
    mfaRequired: boolean;
    email: string | null;
}

export interface UserCreateForm {
    email: string | null;
    password: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
}

export interface UserDto {
    id: number | null;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface ResetPasswordForm {
    email: string;
    tempPassword: string;
    newPassword: string
}

export interface ChangePasswordForm {
    oldPassword: string;
    newPassword: string;
}

export interface ChangeMailForm {
    otp: string;
    newEmail: string;
}