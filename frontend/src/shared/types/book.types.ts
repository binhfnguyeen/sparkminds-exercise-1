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
    categoryId?: number;
    fromTime?: string;
    toTime?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

export interface BookUpdateRequest {
    title: string;
    author: string;
    description: string;
    quantity: number;
    categoryId: number;
    imgUrl?: string;
}

export interface BorrowBookResponse {
    borrowId: number;
    bookId: number;
    title: string;
    author: string;
    imgUrl?: string;
    borrowedAt: string;
    dueDate: string;
    isOverDue: boolean;
}