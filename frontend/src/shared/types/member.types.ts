export interface MemberCreateRequest {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
}

export interface MemberUpdateRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
}

export interface SearchMemberParams {
    keyword?: string;
    dobFrom?: string;
    dobTo?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}