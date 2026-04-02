import { getBorrowedBooksAction } from '@/features/book/actions/book.action';
import { BorrowedBooksList } from '@/features/book/components/BorrowedBooksList';
import { redirect } from 'next/navigation';

export default async function BorrowedBooksPage() {
    try {
        const response = await getBorrowedBooksAction();
        if (response.code === 401) {
            redirect('/client/login');
        }

        const borrowedBooks = response.code === 1000 ? response.result : [];

        return (
            <div className="min-h-screen bg-gray-50/30 relative">
                <div className="absolute top-0 right-0 -mt-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-40 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <BorrowedBooksList borrowedBooks={borrowedBooks} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Lỗi lấy danh sách mượn:", error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
                <div className="text-center p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold text-rose-500 mb-2">Lỗi tải dữ liệu</h2>
                    <p className="text-gray-500">Vui lòng thử lại sau.</p>
                </div>
            </div>
        );
    }
}