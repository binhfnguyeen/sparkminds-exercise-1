import { useState, useEffect } from 'react';
import {BookCreateRequest, BookResponse} from '@/shared/types/book.types';
import { createBookAction, updateBookAction, createCategoryAction, updateCategoryAction } from "@/features/book/actions/book.action";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editingBook: BookResponse | null;
    categories: Category[];
    setCategories: (cats: Category[]) => void;
    onSuccess: () => void;
}

interface Category {
    id: number;
    name: string;
}

export const BookFormModal = ({ isOpen, onClose, editingBook, categories, setCategories, onSuccess }: Props) => {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<BookCreateRequest>({
        title: '', author: '', description: '', quantity: 0, categoryId: 0
    });

    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [editCategoryName, setEditCategoryName] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (editingBook) {
                setFormData({
                    title: editingBook.title,
                    author: editingBook.author,
                    description: editingBook.description || '',
                    quantity: editingBook.quantity,
                    categoryId: editingBook.category?.id || (categories[0]?.id || 0),
                    imgUrl: editingBook.imgUrl
                });
            } else {
                setFormData({ title: '', author: '', description: '', quantity: 0, categoryId: categories[0]?.id || 0 });
            }
            setSelectedFile(null);
            setIsCreatingCategory(false);
            setIsEditingCategory(false);
        }
    }, [isOpen, editingBook, categories]);

    if (!isOpen) return null;

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await createCategoryAction(newCategoryName);

            setIsCreatingCategory(false);
            setNewCategoryName('');

            setCategories([...categories, res.result]);
            setFormData({ ...formData, categoryId: res.result.id });
        } catch (error) {
            alert("Tạo thể loại thất bại!");
        }
    };

    const handleUpdateCategory = async () => {
        if (!editCategoryName.trim() || formData.categoryId === 0) return;
        try {
            const res = await updateCategoryAction(formData.categoryId, editCategoryName);

            setIsEditingCategory(false);
            setEditCategoryName('');

            setCategories(categories.map(cat => cat.id === formData.categoryId ? res.result : cat));
            alert("Cập nhật thể loại thành công!");
        } catch (error) {
            alert("Cập nhật thể loại thất bại!");
        }
    };

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            let fileFormData;
            if (selectedFile) {
                fileFormData = new FormData();
                fileFormData.append('file', selectedFile);
            }

            if (editingBook) {
                await updateBookAction(editingBook.id, formData, fileFormData);
                alert("Cập nhật sách thành công!");
            } else {
                await createBookAction(formData, fileFormData);
                alert("Thêm sách thành công!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            alert(editingBook ? "Cập nhật sách thất bại!" : "Thêm sách thất bại. Vui lòng kiểm tra lại thông tin!");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-2">
                    {editingBook ? (
                        <><svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Cập nhật sách</>
                    ) : (
                        <><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Thêm sách mới</>
                    )}
                </h2>

                <form onSubmit={handleSubmitForm} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Tên sách <span className="text-red-500">*</span></label>
                        <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                               value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nhập tên sách..." />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Tác giả <span className="text-red-500">*</span></label>
                        <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                               value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Nhập tên tác giả..." />
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Số lượng <span className="text-red-500">*</span></label>
                            <input required type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                   value={Number.isNaN(formData.quantity) ? '' : formData.quantity}
                                   onChange={e => setFormData({...formData, quantity: e.target.value === '' ? 0 : parseInt(e.target.value)})} />
                        </div>
                        <div className="w-2/3">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Thể loại <span className="text-red-500">*</span></label>
                            {isCreatingCategory ? (
                                <div className="flex gap-2">
                                    <input autoFocus type="text" className="w-full px-3 py-2 border border-blue-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                           placeholder="Tên thể loại mới..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                                    <button type="button" onClick={handleCreateCategory} className="bg-green-600 text-white px-3 rounded-lg font-bold hover:bg-green-700">Lưu</button>
                                    <button type="button" onClick={() => setIsCreatingCategory(false)} className="bg-gray-100 text-gray-600 px-2.5 rounded-lg border font-bold hover:bg-gray-200">✕</button>
                                </div>
                            ) : isEditingCategory ? (
                                <div className="flex gap-2">
                                    <input autoFocus type="text" className="w-full px-3 py-2 border border-yellow-400 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                                           placeholder="Sửa tên thể loại..." value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} />
                                    <button type="button" onClick={handleUpdateCategory} className="bg-yellow-500 text-white px-3 rounded-lg font-bold hover:bg-yellow-600">Lưu</button>
                                    <button type="button" onClick={() => setIsEditingCategory(false)} className="bg-gray-100 text-gray-600 px-2.5 rounded-lg border font-bold hover:bg-gray-200">✕</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                            value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}>
                                        {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                    </select>
                                    <button type="button" disabled={formData.categoryId === 0 || categories.length === 0}
                                            onClick={() => { const cat = categories.find(c => c.id === formData.categoryId); if (cat) { setEditCategoryName(cat.name); setIsEditingCategory(true); } }}
                                            className="flex-shrink-0 bg-yellow-50 text-yellow-600 px-3 rounded-lg font-bold border border-yellow-200 hover:bg-yellow-100 disabled:opacity-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    <button type="button" onClick={() => setIsCreatingCategory(true)} className="flex-shrink-0 bg-blue-50 text-blue-600 px-3.5 rounded-lg font-bold border border-blue-200 hover:bg-blue-100">+</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Mô tả</label>
                        <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" rows={3}
                                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Nhập mô tả ngắn..." />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Ảnh bìa sách {editingBook && <span className="font-normal text-gray-400">(Bỏ trống nếu không đổi)</span>}</label>
                        <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                               onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end shrink-0">
                        <button
                            type="submit"
                            disabled={submitLoading}
                            className={`px-6 py-2.5 text-white font-bold rounded-xl transition shadow-sm flex items-center gap-2
                            ${editingBook
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-blue-600 hover:bg-blue-700'}
                                disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        >
                            {submitLoading
                                ? 'Đang xử lý...'
                                : editingBook
                                    ? 'Lưu cập nhật'
                                    : 'Lưu sách mới'}
                        </button>
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-700 font-bold bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition shadow-sm">
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};