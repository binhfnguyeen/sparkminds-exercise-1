export interface UserCreateForm {
    email: string | null;
    password: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
}

export interface UserResponse {
    id: number | null;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string | null;
    dateOfBirth: Date | null;
    status: string | null;
    mfaEnabled: boolean | null;
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