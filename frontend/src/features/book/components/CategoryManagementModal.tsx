'use client';

import React, { useState } from 'react';
import { CategoryResponse } from '@/shared/types/book.types';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/features/book/actions/book.action';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    categories: CategoryResponse[];
    onRefresh: () => void;
}

export const CategoryManagementModal: React.FC<Props> = ({ isOpen, onClose, categories, onRefresh }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        setIsLoading(true);
        try {
            await createCategoryAction(newCategoryName);
            setNewCategoryName('');
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Lỗi tạo thể loại");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editingName.trim()) return;
        setIsLoading(true);
        try {
            await updateCategoryAction(id, editingName);
            setEditingId(null);
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Lỗi cập nhật thể loại");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Xóa thể loại này? Các sách thuộc thể loại này có thể bị ảnh hưởng.")) return;
        setIsLoading(true);
        try {
            await deleteCategoryAction(id);
            onRefresh();
        } catch (error: any) {
            alert(error.message || "Lỗi xóa thể loại (Có thể đang có sách dùng thể loại này)");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        Quản lý Thể loại
                    </h3>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition focus:outline-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* FORM ADD NEW */}
                <div className="p-6 pb-4 shrink-0 border-b border-gray-50">
                    <form onSubmit={handleCreate} className="flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nhập tên thể loại mới..."
                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white outline-none transition font-medium text-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !newCategoryName.trim()}
                            className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 transition shadow-sm active:scale-95 shrink-0"
                        >
                            Thêm mới
                        </button>
                    </form>
                </div>

                {/* LIST OF CATEGORIES */}
                <div className="p-6 pt-4 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
                    {categories.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Chưa có thể loại nào.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {categories.map((cat) => (
                                <li key={cat.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${editingId === cat.id ? 'bg-blue-50/50 border border-blue-100' : 'bg-white border border-gray-100 hover:border-gray-300 hover:shadow-sm group'}`}>

                                    {editingId === cat.id ? (
                                        <div className="flex w-full gap-2 items-center">
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-white border-2 border-blue-400 rounded-lg outline-none text-sm font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleUpdate(cat.id)}
                                                disabled={isLoading || !editingName.trim()}
                                                className="shrink-0 px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-sm font-bold transition disabled:opacity-50 shadow-sm"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                disabled={isLoading}
                                                className="shrink-0 px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-bold transition disabled:opacity-50"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                                <span className="font-bold text-gray-700 text-sm">{cat.name}</span>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
                                                    title="Sửa đổi"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
                                                    title="Xóa"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};