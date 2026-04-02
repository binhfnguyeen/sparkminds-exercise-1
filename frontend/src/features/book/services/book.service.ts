import {
    BookCreateRequest,
    BookResponse,
    CategoryResponse,
    SearchBookParams, BookUpdateRequest
} from '@/shared/types/book.types';
import {ApiResponse, PageResponse} from "@/shared/types/api.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const bookService = {
    searchBooks: async (
        token: string,
        params: SearchBookParams
    ): Promise<ApiResponse<PageResponse<BookResponse>>> => {

        const query = new URLSearchParams();
        if (params.keyword) query.append('keyword', params.keyword);
        if (params.categoryId) query.append('categoryId', params.categoryId.toString());
        if (params.fromTime) query.append('fromTime', params.fromTime);
        if (params.toTime) query.append('toTime', params.toTime);
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);

        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/books/search?${query}`, {
            headers: headers,
        });
        if (!res.ok) throw new Error('Lỗi khi tìm kiếm sách');
        return res.json();
    },

    createBook: async (
        token: string,
        data: BookCreateRequest,
        fileFormData?: FormData
    ): Promise<ApiResponse<BookResponse>> => {
        const formData = new FormData();
        formData.append(
            'data',
            new Blob([JSON.stringify(data)], { type: 'application/json' })
        );
        if (fileFormData?.has('file')) {
            formData.append('file', fileFormData.get('file') as Blob);
        }
        const res = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        if (!res.ok) throw new Error('Lỗi khi tạo sách');
        return res.json();
    },

    deleteBook: async (token: string, id: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`, // Delete bắt buộc có auth
            },
        });
        if (!res.ok) throw new Error('Lỗi khi xóa sách');
        return res.json();
    },

    getAllCategories: async (token: string): Promise<ApiResponse<CategoryResponse[]>> => {
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/categories`, {
            headers: headers,
        });
        if (!res.ok) throw new Error('Lỗi khi lấy danh sách thể loại');
        return res.json();
    },

    createCategory: async (token: string, name: string): Promise<ApiResponse<CategoryResponse>> => {
        const res = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error('Lỗi khi tạo thể loại');

        return res.json();
    },

    importBooksCsv: async (token: string, fileFormData: FormData): Promise<ApiResponse<BookResponse[]>> => {
        const res = await fetch(`${API_URL}/books/import`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: fileFormData,
        });
        if (!res.ok) throw new Error('Lỗi khi import file CSV');
        return res.json();
    },

    updateCategory: async (token: string, id: number, name: string): Promise<ApiResponse<CategoryResponse>> => {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        if (!res.ok) throw new Error('Lỗi khi cập nhật thể loại');

        return res.json();
    },

    updateBook: async (
        token: string,
        id: number,
        data: BookUpdateRequest,
        fileFormData?: FormData
    ): Promise<ApiResponse<BookResponse>> => {
        const formData = new FormData();
        formData.append(
            'data',
            new Blob([JSON.stringify(data)], { type: 'application/json' })
        );
        if (fileFormData?.has('file')) {
            formData.append('file', fileFormData.get('file') as Blob);
        }
        const res = await fetch(`${API_URL}/books/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        if (!res.ok) throw new Error('Lỗi khi cập nhật sách');
        return res.json();
    },
};