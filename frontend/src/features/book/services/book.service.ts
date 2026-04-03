import {
    BookCreateRequest,
    BookResponse,
    CategoryResponse,
    SearchBookParams, BookUpdateRequest, BorrowBookResponse, SearchBorrowParams
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

    getDetailBook: async (id: number): Promise<ApiResponse<BookResponse>> => {
        const res = await fetch(`${API_URL}/books/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) throw new Error('Lỗi khi lấy chi tiết sách');

        return res.json()
    },

    borrowBook: async (token: string, bookId: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/books/${bookId}/borrow`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || 'Lỗi hệ thống khi mượn sách');
        }

        return res.json();
    },

    getBorrowedBooks: async (token: string): Promise<ApiResponse<BorrowBookResponse[]>> => {
        const res = await fetch(`${API_URL}/borrow/books`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) throw new Error('Lỗi khi lấy danh sách mượn sách');
        return res.json();
    },

    approveBorrowRequest: async (token: string, borrowId: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/borrow/${borrowId}/approve`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || 'Lỗi khi duyệt yêu cầu');
        }
        return res.json();
    },

    rejectBorrowRequest: async (token: string, borrowId: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/borrow/${borrowId}/reject`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || 'Lỗi khi từ chối yêu cầu');
        }
        return res.json();
    },

    deleteCategory: async (token: string, id: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Lỗi khi xóa thể loại');
        return res.json();
    },

    returnBook: async (token: string, borrowId: number): Promise<ApiResponse<string>> => {
        const res = await fetch(`${API_URL}/borrow/${borrowId}/return`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(errorData?.message || 'Lỗi khi xác nhận trả sách');
        }
        return res.json();
    },

    searchBorrowRecordsAdmin: async (token: string, params: SearchBorrowParams): Promise<ApiResponse<PageResponse<BorrowBookResponse>>> => {
        const query = new URLSearchParams();
        if (params.email) query.append('email', params.email);
        if (params.title) query.append('title', params.title);
        if (params.status) query.append('status', params.status);
        if (params.fromDate) query.append('fromDate', params.fromDate);
        if (params.toDate) query.append('toDate', params.toDate);
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.size !== undefined) query.append('size', params.size.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDir) query.append('sortDir', params.sortDir);

        const res = await fetch(`${API_URL}/admin/borrow/books/search?${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Lỗi khi tìm kiếm yêu cầu mượn sách');
        return res.json();
    }
};