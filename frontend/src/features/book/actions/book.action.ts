'use server';

import { cookies } from 'next/headers';
import { bookService } from '../services/book.service';
import {BookCreateRequest, BookUpdateRequest, SearchBookParams} from '@/shared/types/book.types';
import {revalidatePath} from "next/cache";

const getToken = async (): Promise<string> => {
    const cookieStore = await cookies();
    return (
        cookieStore.get('adminAccessToken')?.value ||
        cookieStore.get('accessToken')?.value ||
        ''
    );
};

export async function searchBooksAction(params: SearchBookParams) {
    const token = await getToken();
    return bookService.searchBooks(token, params);
}

export async function createBookAction(data: BookCreateRequest, file?: FormData) {
    const token = await getToken();
    return bookService.createBook(token, data, file);
}

export async function deleteBookAction(id: number) {
    const token = await getToken();
    return bookService.deleteBook(token, id);
}

export async function getAllCategoriesAction() {
    const token = await getToken();
    return bookService.getAllCategories(token);
}

export async function createCategoryAction(name: string) {
    const token = await getToken();
    return bookService.createCategory(token, name);
}

export async function importBooksCsvAction(fileFormData: FormData) {
    const token = await getToken();
    return bookService.importBooksCsv(token, fileFormData);
}

export async function updateCategoryAction(id: number, name: string) {
    const token = await getToken();
    const result = await bookService.updateCategory(token, id, name);
    revalidatePath('/admin/books');
    return result;
}

export async function updateBookAction(id: number, data: BookUpdateRequest, file?: FormData) {
    const token = await getToken();
    const result = await bookService.updateBook(token, id, data, file);
    revalidatePath('/admin/books');
    return result;
}

export async function getDetailBookAction(id: number){
    return bookService.getDetailBook(id);
}

export async function borrowBookAction(bookId: number) {
    const token = await getToken();
    if (!token) throw new Error("Chưa xác thực");
    return bookService.borrowBook(token, bookId);
}

export async function getBorrowedBooksAction() {
    const token = await getToken();
    if (!token) throw new Error("Chưa xác thực");
    return bookService.getBorrowedBooks(token);
}