import { BookResponse } from '@/shared/types/book.types';

interface Props {
    books: BookResponse[];
    loading: boolean;
    page: number;
    totalPages: number;
    setPage: (p: number | ((prev: number) => number)) => void;
    onEdit: (book: BookResponse) => void;
    onDelete: (id: number) => void;
}

export const BookTable = ({ books, loading, page, totalPages, setPage, onEdit, onDelete }: Props) => {
    return (
        <>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                        <th className="p-4 font-semibold">Ảnh</th>
                        <th className="p-4 font-semibold">Tiêu đề</th>
                        <th className="p-4 font-semibold">Tác giả</th>
                        <th className="p-4 font-semibold">Thể loại</th>
                        <th className="p-4 font-semibold text-center">SL</th>
                        <th className="p-4 font-semibold text-center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-medium">Đang tải dữ liệu hệ thống...</td></tr>
                    ) : books.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-medium">Không tìm thấy sách nào phù hợp.</td></tr>
                    ) : (
                        books.map((book) => (
                            <tr key={book.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-4">
                                    <img
                                        src={book.imgUrl || '/file.svg'} alt="cover"
                                        onError={(e) => { e.currentTarget.src = '/file.svg'; }}
                                        className="w-10 h-14 object-cover rounded shadow-sm border border-gray-200 bg-white"
                                    />
                                </td>
                                <td className="p-4 font-bold text-gray-900">{book.title}</td>
                                <td className="p-4 text-gray-600 font-medium">{book.author}</td>
                                <td className="p-4">
                                    <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-bold">
                                        {book.category?.name || 'Không rõ'}
                                    </span>
                                </td>
                                <td className="p-4 text-center text-gray-900 font-bold">{book.quantity}</td>
                                <td className="p-4 text-center space-x-2">
                                    <button onClick={() => onEdit(book)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Sửa">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    <button onClick={() => onDelete(book.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Xóa">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-end gap-2 mt-4">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-1.5 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg disabled:opacity-50 text-sm font-semibold transition-colors text-gray-700">Trang trước</button>
                <div className="px-4 py-1.5 text-sm text-gray-700 font-bold bg-white border border-gray-200 rounded-lg">Trang {page + 1} / {totalPages || 1}</div>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-1.5 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded-lg disabled:opacity-50 text-sm font-semibold transition-colors text-gray-700">Trang tiếp</button>
            </div>
        </>
    );
};