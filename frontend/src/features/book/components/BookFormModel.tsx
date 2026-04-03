import { useState, useEffect } from 'react';
import { BookCreateRequest, BookResponse } from '@/shared/types/book.types';
import { createBookAction, updateBookAction } from "@/features/book/actions/book.action";

interface Category {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editingBook: BookResponse | null;
    categories: Category[];
    onSuccess: () => void;
}

export const BookFormModal = ({ isOpen, onClose, editingBook, categories, onSuccess }: Props) => {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<BookCreateRequest>({
        title: '', author: '', description: '', quantity: 0, categoryId: 0
    });

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
                // Reset form khi thêm mới
                setFormData({
                    title: '',
                    author: '',
                    description: '',
                    quantity: 0,
                    categoryId: categories[0]?.id || 0
                });
            }
            setSelectedFile(null);
        }
    }, [isOpen, editingBook, categories]);

    if (!isOpen) return null;

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
            onSuccess(); // Load lại data ở trang quản lý
            onClose();   // Đóng Modal
        } catch (error) {
            alert(editingBook ? "Cập nhật sách thất bại!" : "Thêm sách thất bại. Vui lòng kiểm tra lại thông tin!");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {editingBook ? (
                            <>
                                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                Cập nhật thông tin sách
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Thêm sách mới
                            </>
                        )}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition focus:outline-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* FORM BODY */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="bookForm" onSubmit={handleSubmitForm} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold mb-1.5 text-gray-700">Tên sách <span className="text-red-500">*</span></label>
                            <input
                                required type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                placeholder="Nhập tên sách..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1.5 text-gray-700">Tác giả <span className="text-red-500">*</span></label>
                            <input
                                required type="text"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium"
                                value={formData.author}
                                onChange={e => setFormData({...formData, author: e.target.value})}
                                placeholder="Nhập tên tác giả..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <label className="block text-sm font-bold mb-1.5 text-gray-700">Số lượng <span className="text-red-500">*</span></label>
                                <input
                                    required type="number" min="0"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium"
                                    value={Number.isNaN(formData.quantity) ? '' : formData.quantity}
                                    onChange={e => setFormData({...formData, quantity: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="w-2/3">
                                <label className="block text-sm font-bold mb-1.5 text-gray-700">Thể loại <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium cursor-pointer"
                                    value={formData.categoryId}
                                    onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                                >
                                    {categories.length === 0 ? (
                                        <option value={0} disabled>Chưa có thể loại nào</option>
                                    ) : (
                                        categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1.5 text-gray-700">Mô tả nội dung</label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-sm font-medium resize-none custom-scrollbar"
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="Nhập mô tả ngắn về nội dung sách..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1.5 text-gray-700">
                                Ảnh bìa sách
                                {editingBook && <span className="font-medium text-gray-400 ml-1">(Bỏ trống nếu không đổi)</span>}
                            </label>
                            <input
                                type="file" accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition"
                                onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm text-gray-600 font-bold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition focus:outline-none"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        form="bookForm" // Liên kết nút này với form ở trên
                        disabled={submitLoading || categories.length === 0}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm text-white font-bold rounded-xl transition shadow-md focus:outline-none
                        ${editingBook
                            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-500/30'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30'}
                            disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed`}
                    >
                        {submitLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Đang xử lý...
                            </>
                        ) : editingBook ? (
                            'Lưu cập nhật'
                        ) : (
                            'Lưu sách mới'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};