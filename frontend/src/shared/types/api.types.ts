export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface AuthenticateResponse {
    accessToken: string | null;
    refreshToken: string | null;
    mfaRequired: boolean;
    email: string | null;
}

export interface SortResponse {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface PageableResponse {
    pageNumber: number;
    pageSize: number;
    sort: SortResponse;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface PageResponse<T> {
    content: T[];
    pageable: PageableResponse;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}