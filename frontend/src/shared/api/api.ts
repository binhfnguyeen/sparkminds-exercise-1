export interface ApiDto<T> {
    code: number;
    message: string;
    result: T;
};

export interface AuthenticateDto {
    accessToken: string | null;
    refreshToken: string | null;
    mfaRequired: boolean;
    email: string | null;
}