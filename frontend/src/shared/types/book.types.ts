export interface CategoryResponse {
    id: number;
    name: string;
}

export interface BookResponse {
    id: number;
    title: string;
    author: string;
    description: string;
    quantity: number;
    imgUrl: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    category: CategoryResponse;
}

export interface BookCreateRequest {
    title: string;
    author: string;
    description: string;
    quantity: number;
    categoryId: number;
    imgUrl?: string;
}

export interface SearchBookParams {
    keyword?: string;
    fromTime?: string;
    toTime?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
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

export interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface BookUpdateRequest {
    title: string;
    author: string;
    description: string;
    quantity: number;
    categoryId: number;
    imgUrl?: string;
}