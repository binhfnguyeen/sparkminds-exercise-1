'use client';

import { useState, useEffect, useRef } from 'react';
import { BookResponse, CategoryResponse } from '@/shared/types/book.types';
import { deleteBookAction, getAllCategoriesAction, importBooksCsvAction, searchBooksAction } from "@/features/book/actions/book.action";
import { BookFilterForm } from "@/features/book/components/BookFilterForm";
import { BookTable } from "@/features/book/components/BookTable";
import { BookFormModal } from "@/features/book/components/BookFormModel";
import { CategoryManagementModal } from "@/features/book/components/CategoryManagementModal";

export default function BookManagementPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('DESC');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // State mở Modal Category
    const [editingBook, setEditingBook] = useState<BookResponse | null>(null);

    const loadCategories = async () => {
        try {
            const categoriesRes = await getAllCategoriesAction();
            if (categoriesRes.code === 1000) setCategories(categoriesRes.result);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const formatToBackendDate = (dateStr: string, isEnd: boolean) => {
                if (!dateStr) return undefined;
                const [year, month, day] = dateStr.split('-');
                return `${day}${month}${year} ${isEnd ? '235959' : '000000'}`;
            };

            const [booksRes] = await Promise.all([
                searchBooksAction({
                    page, size: 10, keyword,
                    fromTime: formatToBackendDate(fromTime, false),
                    toTime: formatToBackendDate(toTime, true),
                    sortBy, sortDir
                }),
                loadCategories()
            ]);

            setBooks(booksRes.result.content);
            setTotalPages(booksRes.result.totalPages);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [page]);

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(0); loadData(); };

    const handleClearFilter = () => {
        setKeyword(''); setFromTime(''); setToTime(''); setSortBy('id'); setSortDir('DESC'); setPage(0);
        searchBooksAction({ page: 0, size: 10, keyword: '', sortBy: 'id', sortDir: 'DESC' }).then(res => {
            setBooks(res.result.content);
            setTotalPages(res.result.totalPages);
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) return;
        try { await deleteBookAction(id); loadData(); } catch (error) { alert("Xóa thất bại"); }
    };

    const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        try {
            setLoading(true);
            await importBooksCsvAction(uploadFormData);
            alert("Import CSV thành công!");
            loadData();
        } catch (error) {
            alert("Import CSV thất bại. Vui lòng kiểm tra định dạng file!");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Sách</h1>
                <div className="flex flex-wrap gap-3">
                    <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleImportCsv} />

                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        Import CSV
                    </button>

                    <button onClick={() => setIsCategoryModalOpen(true)} className="flex items-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        Quản lý Thể loại
                    </button>

                    <button onClick={() => { setEditingBook(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Thêm sách mới
                    </button>
                </div>
            </div>

            <BookFilterForm
                keyword={keyword} setKeyword={setKeyword}
                fromTime={fromTime} setFromTime={setFromTime}
                toTime={toTime} setToTime={setToTime}
                sortBy={sortBy} setSortBy={setSortBy}
                sortDir={sortDir} setSortDir={setSortDir}
                onSearch={handleSearch} onClear={handleClearFilter}
            />

            <BookTable
                books={books} loading={loading} page={page} totalPages={totalPages} setPage={setPage}
                onDelete={handleDelete}
                onEdit={(book) => { setEditingBook(book); setIsModalOpen(true); }}
            />

            <BookFormModal
                isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                editingBook={editingBook}
                categories={categories}
                onSuccess={loadData}
            />

            <CategoryManagementModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categories}
                onRefresh={loadCategories}
            />
        </div>
    );
}