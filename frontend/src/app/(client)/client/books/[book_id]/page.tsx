import { getDetailBookAction } from '@/features/book/actions/book.action';
import { BookDetailDisplay } from '@/features/book/components/BookDetailDisplay';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ book_id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
    const { book_id } = await params;
    const bookId = parseInt(book_id);
    if (isNaN(bookId)) return notFound();
    try {
        const response = await getDetailBookAction(bookId);
        const bookData = response.code === 1000 ? response.result : null;
        if (!bookData) {
            return notFound();
        }
        return (
            <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-xl shadow-xl rounded-[2rem] overflow-hidden relative">
                <BookDetailDisplay book={bookData} />
            </div>
        );
    } catch (error) {
        console.error("Lỗi detail book:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-6 max-w-md w-full">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-100">
                            <svg
                                className="w-6 h-6 text-amber-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        Không thể tải thông tin sách
                    </h2>

                    <p className="text-gray-500 text-sm mb-4">
                        Có vẻ đã xảy ra lỗi nhỏ. Vui lòng thử lại sau.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }
}